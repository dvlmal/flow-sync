import { Injectable, OnModuleInit, Logger } from '@nestjs/common';

interface SupabaseResponse<T = any> {
  data: T | null;
  error: { message: string; code?: string } | null;
  count?: number | null;
}

/**
 * Supabase REST API 서비스
 * - 직접 fetch를 사용하여 Supabase REST API 호출
 * - Vercel serverless 환경 완벽 호환 (외부 의존성 없음)
 */
@Injectable()
export class SupabaseService implements OnModuleInit {
  private readonly logger = new Logger(SupabaseService.name);
  private readonly baseUrl: string;
  private readonly headers: Record<string, string>;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required',
      );
    }

    this.baseUrl = `${supabaseUrl}/rest/v1`;
    this.headers = {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    };

    const isVercel = !!process.env.VERCEL;
    this.logger.log(
      `SupabaseService initialized [env: ${isVercel ? 'Vercel' : 'Local'}]`,
    );
  }

  async onModuleInit() {
    // 연결 테스트 (실패해도 앱 시작은 허용)
    try {
      const result = await this.from('project').select('id').limit(1);
      if (result.error) {
        this.logger.warn(
          'Supabase connection test failed:',
          result.error.message,
        );
      } else {
        this.logger.log('Successfully connected to Supabase');
      }
    } catch (error: any) {
      this.logger.warn('Supabase connection test error:', error.message);
    }
  }

  /**
   * 테이블 쿼리 빌더 반환
   */
  from(table: string): QueryBuilder {
    return new QueryBuilder(this.baseUrl, this.headers, table);
  }

  /**
   * 헬스 체크
   */
  async healthCheck(): Promise<{ status: 'ok' | 'error'; latencyMs: number }> {
    const startTime = Date.now();

    try {
      const result = await this.from('project').select('id').limit(1);
      return {
        status: result.error ? 'error' : 'ok',
        latencyMs: Date.now() - startTime,
      };
    } catch {
      return {
        status: 'error',
        latencyMs: Date.now() - startTime,
      };
    }
  }
}

/**
 * Supabase 스타일 쿼리 빌더
 */
class QueryBuilder {
  private readonly baseUrl: string;
  private readonly headers: Record<string, string>;
  private readonly table: string;
  private selectColumns = '*';
  private filters: string[] = [];
  private orderClause = '';
  private limitValue: number | null = null;
  private offsetValue: number | null = null;
  private countOption: 'exact' | null = null;
  private headOnly = false;

  constructor(baseUrl: string, headers: Record<string, string>, table: string) {
    this.baseUrl = baseUrl;
    this.headers = headers;
    this.table = table;
  }

  select(
    columns: string,
    options?: { count?: 'exact'; head?: boolean },
  ): QueryBuilder {
    this.selectColumns = columns;
    if (options?.count) this.countOption = options.count;
    if (options?.head) this.headOnly = options.head;
    return this;
  }

  eq(column: string, value: string | number | null): QueryBuilder {
    this.filters.push(`${column}=eq.${value}`);
    return this;
  }

  neq(column: string, value: string | number | null): QueryBuilder {
    this.filters.push(`${column}=neq.${value}`);
    return this;
  }

  is(column: string, value: null): QueryBuilder {
    this.filters.push(`${column}=is.${value}`);
    return this;
  }

  or(conditions: string): QueryBuilder {
    this.filters.push(`or=(${conditions})`);
    return this;
  }

  gte(column: string, value: string | number): QueryBuilder {
    this.filters.push(`${column}=gte.${value}`);
    return this;
  }

  lte(column: string, value: string | number): QueryBuilder {
    this.filters.push(`${column}=lte.${value}`);
    return this;
  }

  lt(column: string, value: string | number): QueryBuilder {
    this.filters.push(`${column}=lt.${value}`);
    return this;
  }

  in(column: string, values: (string | number)[]): QueryBuilder {
    if (values.length === 0) {
      // 빈 배열인 경우 항상 false가 되는 조건 추가
      this.filters.push(`${column}=eq.impossible_value_that_never_matches`);
    } else {
      const escapedValues = values.map((v) =>
        typeof v === 'string' ? `"${v}"` : v,
      );
      this.filters.push(`${column}=in.(${escapedValues.join(',')})`);
    }
    return this;
  }

  order(column: string, options?: { ascending?: boolean }): QueryBuilder {
    const direction = options?.ascending === false ? 'desc' : 'asc';
    this.orderClause = `order=${column}.${direction}`;
    return this;
  }

  limit(count: number): QueryBuilder {
    this.limitValue = count;
    return this;
  }

  range(from: number, to: number): QueryBuilder {
    this.offsetValue = from;
    this.limitValue = to - from + 1;
    return this;
  }

  single(): SingleQueryBuilder {
    this.limitValue = 1;
    return new SingleQueryBuilder(this);
  }

  async execute(): Promise<SupabaseResponse<any[]>> {
    const url = this.buildUrl();
    const headers = { ...this.headers };

    if (this.countOption === 'exact') {
      headers['Prefer'] = 'count=exact';
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      const contentRange = response.headers.get('content-range');
      let count: number | null = null;
      if (contentRange) {
        const match = contentRange.match(/\/(\d+|\*)/);
        if (match && match[1] !== '*') {
          count = parseInt(match[1], 10);
        }
      }

      if (this.headOnly) {
        return { data: null, error: null, count };
      }

      if (!response.ok) {
        const error = await response.json();
        return {
          data: null,
          error: { message: error.message || 'Unknown error' },
        };
      }

      const data = await response.json();
      return { data, error: null, count };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }

  private buildUrl(): string {
    const params: string[] = [];
    params.push(`select=${encodeURIComponent(this.selectColumns)}`);

    for (const filter of this.filters) {
      params.push(filter);
    }

    if (this.orderClause) {
      params.push(this.orderClause);
    }

    if (this.limitValue !== null) {
      params.push(`limit=${this.limitValue}`);
    }

    if (this.offsetValue !== null) {
      params.push(`offset=${this.offsetValue}`);
    }

    return `${this.baseUrl}/${this.table}?${params.join('&')}`;
  }

  // Proxy methods for direct await
  then<T>(
    onfulfilled?: (value: SupabaseResponse<any[]>) => T | PromiseLike<T>,
  ): Promise<T> {
    return this.execute().then(onfulfilled);
  }

  // INSERT
  insert(data: Record<string, any> | Record<string, any>[]): InsertBuilder {
    return new InsertBuilder(this.baseUrl, this.headers, this.table, data);
  }

  // UPDATE
  update(data: Record<string, any>): UpdateBuilder {
    return new UpdateBuilder(
      this.baseUrl,
      this.headers,
      this.table,
      data,
      this.filters,
    );
  }

  // DELETE
  delete(): DeleteBuilder {
    return new DeleteBuilder(
      this.baseUrl,
      this.headers,
      this.table,
      this.filters,
    );
  }
}

class SingleQueryBuilder {
  private queryBuilder: QueryBuilder;

  constructor(queryBuilder: QueryBuilder) {
    this.queryBuilder = queryBuilder;
  }

  async execute(): Promise<SupabaseResponse<any>> {
    const result = await this.queryBuilder.execute();
    if (result.error) {
      return { data: null, error: result.error };
    }
    return { data: result.data?.[0] ?? null, error: null };
  }

  then<T>(
    onfulfilled?: (value: SupabaseResponse<any>) => T | PromiseLike<T>,
  ): Promise<T> {
    return this.execute().then(onfulfilled);
  }
}

class InsertBuilder {
  private readonly baseUrl: string;
  private readonly headers: Record<string, string>;
  private readonly table: string;
  private readonly insertData: Record<string, any> | Record<string, any>[];
  private selectColumns = '*';
  private returnSingle = false;

  constructor(
    baseUrl: string,
    headers: Record<string, string>,
    table: string,
    data: Record<string, any> | Record<string, any>[],
  ) {
    this.baseUrl = baseUrl;
    this.headers = headers;
    this.table = table;
    this.insertData = data;
  }

  select(columns: string): InsertBuilder {
    this.selectColumns = columns;
    return this;
  }

  single(): InsertBuilder {
    this.returnSingle = true;
    return this;
  }

  async execute(): Promise<SupabaseResponse<any>> {
    const url = `${this.baseUrl}/${this.table}?select=${encodeURIComponent(this.selectColumns)}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(this.insertData),
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          data: null,
          error: { message: error.message || 'Insert failed' },
        };
      }

      const data = await response.json();
      return {
        data: this.returnSingle ? data[0] : data,
        error: null,
      };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }

  then<T>(
    onfulfilled?: (value: SupabaseResponse<any>) => T | PromiseLike<T>,
  ): Promise<T> {
    return this.execute().then(onfulfilled);
  }
}

class UpdateBuilder {
  private readonly baseUrl: string;
  private readonly headers: Record<string, string>;
  private readonly table: string;
  private readonly updateData: Record<string, any>;
  private filters: string[];

  constructor(
    baseUrl: string,
    headers: Record<string, string>,
    table: string,
    data: Record<string, any>,
    filters: string[],
  ) {
    this.baseUrl = baseUrl;
    this.headers = headers;
    this.table = table;
    this.updateData = data;
    this.filters = [...filters];
  }

  eq(column: string, value: string | number | null): UpdateBuilder {
    this.filters.push(`${column}=eq.${value}`);
    return this;
  }

  async execute(): Promise<SupabaseResponse<any>> {
    const params = this.filters.join('&');
    const url = `${this.baseUrl}/${this.table}?${params}`;

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: this.headers,
        body: JSON.stringify(this.updateData),
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          data: null,
          error: { message: error.message || 'Update failed' },
        };
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }

  then<T>(
    onfulfilled?: (value: SupabaseResponse<any>) => T | PromiseLike<T>,
  ): Promise<T> {
    return this.execute().then(onfulfilled);
  }
}

class DeleteBuilder {
  private readonly baseUrl: string;
  private readonly headers: Record<string, string>;
  private readonly table: string;
  private filters: string[];

  constructor(
    baseUrl: string,
    headers: Record<string, string>,
    table: string,
    filters: string[],
  ) {
    this.baseUrl = baseUrl;
    this.headers = headers;
    this.table = table;
    this.filters = [...filters];
  }

  eq(column: string, value: string | number | null): DeleteBuilder {
    this.filters.push(`${column}=eq.${value}`);
    return this;
  }

  async execute(): Promise<SupabaseResponse<any>> {
    const params = this.filters.join('&');
    const url = `${this.baseUrl}/${this.table}?${params}`;

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.headers,
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          data: null,
          error: { message: error.message || 'Delete failed' },
        };
      }

      return { data: null, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }

  then<T>(
    onfulfilled?: (value: SupabaseResponse<any>) => T | PromiseLike<T>,
  ): Promise<T> {
    return this.execute().then(onfulfilled);
  }
}
