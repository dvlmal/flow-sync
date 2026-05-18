
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model profiles
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export type profiles = $Result.DefaultSelection<Prisma.$profilesPayload>
/**
 * Model project
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export type project = $Result.DefaultSelection<Prisma.$projectPayload>
/**
 * Model sync_log
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export type sync_log = $Result.DefaultSelection<Prisma.$sync_logPayload>
/**
 * Model task
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export type task = $Result.DefaultSelection<Prisma.$taskPayload>
/**
 * Model workflow_status
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export type workflow_status = $Result.DefaultSelection<Prisma.$workflow_statusPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Profiles
 * const profiles = await prisma.profiles.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Profiles
   * const profiles = await prisma.profiles.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.profiles`: Exposes CRUD operations for the **profiles** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Profiles
    * const profiles = await prisma.profiles.findMany()
    * ```
    */
  get profiles(): Prisma.profilesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.project`: Exposes CRUD operations for the **project** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Projects
    * const projects = await prisma.project.findMany()
    * ```
    */
  get project(): Prisma.projectDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.sync_log`: Exposes CRUD operations for the **sync_log** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sync_logs
    * const sync_logs = await prisma.sync_log.findMany()
    * ```
    */
  get sync_log(): Prisma.sync_logDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.task`: Exposes CRUD operations for the **task** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tasks
    * const tasks = await prisma.task.findMany()
    * ```
    */
  get task(): Prisma.taskDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.workflow_status`: Exposes CRUD operations for the **workflow_status** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Workflow_statuses
    * const workflow_statuses = await prisma.workflow_status.findMany()
    * ```
    */
  get workflow_status(): Prisma.workflow_statusDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.8.0
   * Query Engine version: 3c6e192761c0362d496ed980de936e2f3cebcd3a
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    profiles: 'profiles',
    project: 'project',
    sync_log: 'sync_log',
    task: 'task',
    workflow_status: 'workflow_status'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "profiles" | "project" | "sync_log" | "task" | "workflow_status"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      profiles: {
        payload: Prisma.$profilesPayload<ExtArgs>
        fields: Prisma.profilesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.profilesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$profilesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.profilesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$profilesPayload>
          }
          findFirst: {
            args: Prisma.profilesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$profilesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.profilesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$profilesPayload>
          }
          findMany: {
            args: Prisma.profilesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$profilesPayload>[]
          }
          create: {
            args: Prisma.profilesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$profilesPayload>
          }
          createMany: {
            args: Prisma.profilesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.profilesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$profilesPayload>[]
          }
          delete: {
            args: Prisma.profilesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$profilesPayload>
          }
          update: {
            args: Prisma.profilesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$profilesPayload>
          }
          deleteMany: {
            args: Prisma.profilesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.profilesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.profilesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$profilesPayload>[]
          }
          upsert: {
            args: Prisma.profilesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$profilesPayload>
          }
          aggregate: {
            args: Prisma.ProfilesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProfiles>
          }
          groupBy: {
            args: Prisma.profilesGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProfilesGroupByOutputType>[]
          }
          count: {
            args: Prisma.profilesCountArgs<ExtArgs>
            result: $Utils.Optional<ProfilesCountAggregateOutputType> | number
          }
        }
      }
      project: {
        payload: Prisma.$projectPayload<ExtArgs>
        fields: Prisma.projectFieldRefs
        operations: {
          findUnique: {
            args: Prisma.projectFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$projectPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.projectFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$projectPayload>
          }
          findFirst: {
            args: Prisma.projectFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$projectPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.projectFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$projectPayload>
          }
          findMany: {
            args: Prisma.projectFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$projectPayload>[]
          }
          create: {
            args: Prisma.projectCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$projectPayload>
          }
          createMany: {
            args: Prisma.projectCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.projectCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$projectPayload>[]
          }
          delete: {
            args: Prisma.projectDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$projectPayload>
          }
          update: {
            args: Prisma.projectUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$projectPayload>
          }
          deleteMany: {
            args: Prisma.projectDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.projectUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.projectUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$projectPayload>[]
          }
          upsert: {
            args: Prisma.projectUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$projectPayload>
          }
          aggregate: {
            args: Prisma.ProjectAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProject>
          }
          groupBy: {
            args: Prisma.projectGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectGroupByOutputType>[]
          }
          count: {
            args: Prisma.projectCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectCountAggregateOutputType> | number
          }
        }
      }
      sync_log: {
        payload: Prisma.$sync_logPayload<ExtArgs>
        fields: Prisma.sync_logFieldRefs
        operations: {
          findUnique: {
            args: Prisma.sync_logFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sync_logPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.sync_logFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sync_logPayload>
          }
          findFirst: {
            args: Prisma.sync_logFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sync_logPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.sync_logFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sync_logPayload>
          }
          findMany: {
            args: Prisma.sync_logFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sync_logPayload>[]
          }
          create: {
            args: Prisma.sync_logCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sync_logPayload>
          }
          createMany: {
            args: Prisma.sync_logCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.sync_logCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sync_logPayload>[]
          }
          delete: {
            args: Prisma.sync_logDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sync_logPayload>
          }
          update: {
            args: Prisma.sync_logUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sync_logPayload>
          }
          deleteMany: {
            args: Prisma.sync_logDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.sync_logUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.sync_logUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sync_logPayload>[]
          }
          upsert: {
            args: Prisma.sync_logUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sync_logPayload>
          }
          aggregate: {
            args: Prisma.Sync_logAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSync_log>
          }
          groupBy: {
            args: Prisma.sync_logGroupByArgs<ExtArgs>
            result: $Utils.Optional<Sync_logGroupByOutputType>[]
          }
          count: {
            args: Prisma.sync_logCountArgs<ExtArgs>
            result: $Utils.Optional<Sync_logCountAggregateOutputType> | number
          }
        }
      }
      task: {
        payload: Prisma.$taskPayload<ExtArgs>
        fields: Prisma.taskFieldRefs
        operations: {
          findUnique: {
            args: Prisma.taskFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$taskPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.taskFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$taskPayload>
          }
          findFirst: {
            args: Prisma.taskFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$taskPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.taskFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$taskPayload>
          }
          findMany: {
            args: Prisma.taskFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$taskPayload>[]
          }
          create: {
            args: Prisma.taskCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$taskPayload>
          }
          createMany: {
            args: Prisma.taskCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.taskCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$taskPayload>[]
          }
          delete: {
            args: Prisma.taskDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$taskPayload>
          }
          update: {
            args: Prisma.taskUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$taskPayload>
          }
          deleteMany: {
            args: Prisma.taskDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.taskUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.taskUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$taskPayload>[]
          }
          upsert: {
            args: Prisma.taskUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$taskPayload>
          }
          aggregate: {
            args: Prisma.TaskAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTask>
          }
          groupBy: {
            args: Prisma.taskGroupByArgs<ExtArgs>
            result: $Utils.Optional<TaskGroupByOutputType>[]
          }
          count: {
            args: Prisma.taskCountArgs<ExtArgs>
            result: $Utils.Optional<TaskCountAggregateOutputType> | number
          }
        }
      }
      workflow_status: {
        payload: Prisma.$workflow_statusPayload<ExtArgs>
        fields: Prisma.workflow_statusFieldRefs
        operations: {
          findUnique: {
            args: Prisma.workflow_statusFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$workflow_statusPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.workflow_statusFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$workflow_statusPayload>
          }
          findFirst: {
            args: Prisma.workflow_statusFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$workflow_statusPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.workflow_statusFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$workflow_statusPayload>
          }
          findMany: {
            args: Prisma.workflow_statusFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$workflow_statusPayload>[]
          }
          create: {
            args: Prisma.workflow_statusCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$workflow_statusPayload>
          }
          createMany: {
            args: Prisma.workflow_statusCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.workflow_statusCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$workflow_statusPayload>[]
          }
          delete: {
            args: Prisma.workflow_statusDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$workflow_statusPayload>
          }
          update: {
            args: Prisma.workflow_statusUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$workflow_statusPayload>
          }
          deleteMany: {
            args: Prisma.workflow_statusDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.workflow_statusUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.workflow_statusUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$workflow_statusPayload>[]
          }
          upsert: {
            args: Prisma.workflow_statusUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$workflow_statusPayload>
          }
          aggregate: {
            args: Prisma.Workflow_statusAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWorkflow_status>
          }
          groupBy: {
            args: Prisma.workflow_statusGroupByArgs<ExtArgs>
            result: $Utils.Optional<Workflow_statusGroupByOutputType>[]
          }
          count: {
            args: Prisma.workflow_statusCountArgs<ExtArgs>
            result: $Utils.Optional<Workflow_statusCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    profiles?: profilesOmit
    project?: projectOmit
    sync_log?: sync_logOmit
    task?: taskOmit
    workflow_status?: workflow_statusOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ProjectCountOutputType
   */

  export type ProjectCountOutputType = {
    task: number
    workflow_status: number
  }

  export type ProjectCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    task?: boolean | ProjectCountOutputTypeCountTaskArgs
    workflow_status?: boolean | ProjectCountOutputTypeCountWorkflow_statusArgs
  }

  // Custom InputTypes
  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectCountOutputType
     */
    select?: ProjectCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountTaskArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: taskWhereInput
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountWorkflow_statusArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: workflow_statusWhereInput
  }


  /**
   * Count Type TaskCountOutputType
   */

  export type TaskCountOutputType = {
    sync_log: number
  }

  export type TaskCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sync_log?: boolean | TaskCountOutputTypeCountSync_logArgs
  }

  // Custom InputTypes
  /**
   * TaskCountOutputType without action
   */
  export type TaskCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskCountOutputType
     */
    select?: TaskCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TaskCountOutputType without action
   */
  export type TaskCountOutputTypeCountSync_logArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: sync_logWhereInput
  }


  /**
   * Count Type Workflow_statusCountOutputType
   */

  export type Workflow_statusCountOutputType = {
    task: number
  }

  export type Workflow_statusCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    task?: boolean | Workflow_statusCountOutputTypeCountTaskArgs
  }

  // Custom InputTypes
  /**
   * Workflow_statusCountOutputType without action
   */
  export type Workflow_statusCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workflow_statusCountOutputType
     */
    select?: Workflow_statusCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * Workflow_statusCountOutputType without action
   */
  export type Workflow_statusCountOutputTypeCountTaskArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: taskWhereInput
  }


  /**
   * Models
   */

  /**
   * Model profiles
   */

  export type AggregateProfiles = {
    _count: ProfilesCountAggregateOutputType | null
    _min: ProfilesMinAggregateOutputType | null
    _max: ProfilesMaxAggregateOutputType | null
  }

  export type ProfilesMinAggregateOutputType = {
    id: string | null
    full_name: string | null
    notion_user_id: string | null
    avatar_url: string | null
  }

  export type ProfilesMaxAggregateOutputType = {
    id: string | null
    full_name: string | null
    notion_user_id: string | null
    avatar_url: string | null
  }

  export type ProfilesCountAggregateOutputType = {
    id: number
    full_name: number
    notion_user_id: number
    avatar_url: number
    _all: number
  }


  export type ProfilesMinAggregateInputType = {
    id?: true
    full_name?: true
    notion_user_id?: true
    avatar_url?: true
  }

  export type ProfilesMaxAggregateInputType = {
    id?: true
    full_name?: true
    notion_user_id?: true
    avatar_url?: true
  }

  export type ProfilesCountAggregateInputType = {
    id?: true
    full_name?: true
    notion_user_id?: true
    avatar_url?: true
    _all?: true
  }

  export type ProfilesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which profiles to aggregate.
     */
    where?: profilesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of profiles to fetch.
     */
    orderBy?: profilesOrderByWithRelationInput | profilesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: profilesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned profiles
    **/
    _count?: true | ProfilesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProfilesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProfilesMaxAggregateInputType
  }

  export type GetProfilesAggregateType<T extends ProfilesAggregateArgs> = {
        [P in keyof T & keyof AggregateProfiles]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProfiles[P]>
      : GetScalarType<T[P], AggregateProfiles[P]>
  }




  export type profilesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: profilesWhereInput
    orderBy?: profilesOrderByWithAggregationInput | profilesOrderByWithAggregationInput[]
    by: ProfilesScalarFieldEnum[] | ProfilesScalarFieldEnum
    having?: profilesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProfilesCountAggregateInputType | true
    _min?: ProfilesMinAggregateInputType
    _max?: ProfilesMaxAggregateInputType
  }

  export type ProfilesGroupByOutputType = {
    id: string
    full_name: string | null
    notion_user_id: string | null
    avatar_url: string | null
    _count: ProfilesCountAggregateOutputType | null
    _min: ProfilesMinAggregateOutputType | null
    _max: ProfilesMaxAggregateOutputType | null
  }

  type GetProfilesGroupByPayload<T extends profilesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProfilesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProfilesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProfilesGroupByOutputType[P]>
            : GetScalarType<T[P], ProfilesGroupByOutputType[P]>
        }
      >
    >


  export type profilesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    full_name?: boolean
    notion_user_id?: boolean
    avatar_url?: boolean
  }, ExtArgs["result"]["profiles"]>

  export type profilesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    full_name?: boolean
    notion_user_id?: boolean
    avatar_url?: boolean
  }, ExtArgs["result"]["profiles"]>

  export type profilesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    full_name?: boolean
    notion_user_id?: boolean
    avatar_url?: boolean
  }, ExtArgs["result"]["profiles"]>

  export type profilesSelectScalar = {
    id?: boolean
    full_name?: boolean
    notion_user_id?: boolean
    avatar_url?: boolean
  }

  export type profilesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "full_name" | "notion_user_id" | "avatar_url", ExtArgs["result"]["profiles"]>

  export type $profilesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "profiles"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      full_name: string | null
      notion_user_id: string | null
      avatar_url: string | null
    }, ExtArgs["result"]["profiles"]>
    composites: {}
  }

  type profilesGetPayload<S extends boolean | null | undefined | profilesDefaultArgs> = $Result.GetResult<Prisma.$profilesPayload, S>

  type profilesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<profilesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProfilesCountAggregateInputType | true
    }

  export interface profilesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['profiles'], meta: { name: 'profiles' } }
    /**
     * Find zero or one Profiles that matches the filter.
     * @param {profilesFindUniqueArgs} args - Arguments to find a Profiles
     * @example
     * // Get one Profiles
     * const profiles = await prisma.profiles.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends profilesFindUniqueArgs>(args: SelectSubset<T, profilesFindUniqueArgs<ExtArgs>>): Prisma__profilesClient<$Result.GetResult<Prisma.$profilesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Profiles that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {profilesFindUniqueOrThrowArgs} args - Arguments to find a Profiles
     * @example
     * // Get one Profiles
     * const profiles = await prisma.profiles.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends profilesFindUniqueOrThrowArgs>(args: SelectSubset<T, profilesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__profilesClient<$Result.GetResult<Prisma.$profilesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Profiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {profilesFindFirstArgs} args - Arguments to find a Profiles
     * @example
     * // Get one Profiles
     * const profiles = await prisma.profiles.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends profilesFindFirstArgs>(args?: SelectSubset<T, profilesFindFirstArgs<ExtArgs>>): Prisma__profilesClient<$Result.GetResult<Prisma.$profilesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Profiles that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {profilesFindFirstOrThrowArgs} args - Arguments to find a Profiles
     * @example
     * // Get one Profiles
     * const profiles = await prisma.profiles.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends profilesFindFirstOrThrowArgs>(args?: SelectSubset<T, profilesFindFirstOrThrowArgs<ExtArgs>>): Prisma__profilesClient<$Result.GetResult<Prisma.$profilesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Profiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {profilesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Profiles
     * const profiles = await prisma.profiles.findMany()
     * 
     * // Get first 10 Profiles
     * const profiles = await prisma.profiles.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const profilesWithIdOnly = await prisma.profiles.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends profilesFindManyArgs>(args?: SelectSubset<T, profilesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$profilesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Profiles.
     * @param {profilesCreateArgs} args - Arguments to create a Profiles.
     * @example
     * // Create one Profiles
     * const Profiles = await prisma.profiles.create({
     *   data: {
     *     // ... data to create a Profiles
     *   }
     * })
     * 
     */
    create<T extends profilesCreateArgs>(args: SelectSubset<T, profilesCreateArgs<ExtArgs>>): Prisma__profilesClient<$Result.GetResult<Prisma.$profilesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Profiles.
     * @param {profilesCreateManyArgs} args - Arguments to create many Profiles.
     * @example
     * // Create many Profiles
     * const profiles = await prisma.profiles.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends profilesCreateManyArgs>(args?: SelectSubset<T, profilesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Profiles and returns the data saved in the database.
     * @param {profilesCreateManyAndReturnArgs} args - Arguments to create many Profiles.
     * @example
     * // Create many Profiles
     * const profiles = await prisma.profiles.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Profiles and only return the `id`
     * const profilesWithIdOnly = await prisma.profiles.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends profilesCreateManyAndReturnArgs>(args?: SelectSubset<T, profilesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$profilesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Profiles.
     * @param {profilesDeleteArgs} args - Arguments to delete one Profiles.
     * @example
     * // Delete one Profiles
     * const Profiles = await prisma.profiles.delete({
     *   where: {
     *     // ... filter to delete one Profiles
     *   }
     * })
     * 
     */
    delete<T extends profilesDeleteArgs>(args: SelectSubset<T, profilesDeleteArgs<ExtArgs>>): Prisma__profilesClient<$Result.GetResult<Prisma.$profilesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Profiles.
     * @param {profilesUpdateArgs} args - Arguments to update one Profiles.
     * @example
     * // Update one Profiles
     * const profiles = await prisma.profiles.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends profilesUpdateArgs>(args: SelectSubset<T, profilesUpdateArgs<ExtArgs>>): Prisma__profilesClient<$Result.GetResult<Prisma.$profilesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Profiles.
     * @param {profilesDeleteManyArgs} args - Arguments to filter Profiles to delete.
     * @example
     * // Delete a few Profiles
     * const { count } = await prisma.profiles.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends profilesDeleteManyArgs>(args?: SelectSubset<T, profilesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {profilesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Profiles
     * const profiles = await prisma.profiles.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends profilesUpdateManyArgs>(args: SelectSubset<T, profilesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Profiles and returns the data updated in the database.
     * @param {profilesUpdateManyAndReturnArgs} args - Arguments to update many Profiles.
     * @example
     * // Update many Profiles
     * const profiles = await prisma.profiles.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Profiles and only return the `id`
     * const profilesWithIdOnly = await prisma.profiles.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends profilesUpdateManyAndReturnArgs>(args: SelectSubset<T, profilesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$profilesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Profiles.
     * @param {profilesUpsertArgs} args - Arguments to update or create a Profiles.
     * @example
     * // Update or create a Profiles
     * const profiles = await prisma.profiles.upsert({
     *   create: {
     *     // ... data to create a Profiles
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Profiles we want to update
     *   }
     * })
     */
    upsert<T extends profilesUpsertArgs>(args: SelectSubset<T, profilesUpsertArgs<ExtArgs>>): Prisma__profilesClient<$Result.GetResult<Prisma.$profilesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {profilesCountArgs} args - Arguments to filter Profiles to count.
     * @example
     * // Count the number of Profiles
     * const count = await prisma.profiles.count({
     *   where: {
     *     // ... the filter for the Profiles we want to count
     *   }
     * })
    **/
    count<T extends profilesCountArgs>(
      args?: Subset<T, profilesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProfilesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfilesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProfilesAggregateArgs>(args: Subset<T, ProfilesAggregateArgs>): Prisma.PrismaPromise<GetProfilesAggregateType<T>>

    /**
     * Group by Profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {profilesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends profilesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: profilesGroupByArgs['orderBy'] }
        : { orderBy?: profilesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, profilesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProfilesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the profiles model
   */
  readonly fields: profilesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for profiles.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__profilesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the profiles model
   */
  interface profilesFieldRefs {
    readonly id: FieldRef<"profiles", 'String'>
    readonly full_name: FieldRef<"profiles", 'String'>
    readonly notion_user_id: FieldRef<"profiles", 'String'>
    readonly avatar_url: FieldRef<"profiles", 'String'>
  }
    

  // Custom InputTypes
  /**
   * profiles findUnique
   */
  export type profilesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the profiles
     */
    select?: profilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the profiles
     */
    omit?: profilesOmit<ExtArgs> | null
    /**
     * Filter, which profiles to fetch.
     */
    where: profilesWhereUniqueInput
  }

  /**
   * profiles findUniqueOrThrow
   */
  export type profilesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the profiles
     */
    select?: profilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the profiles
     */
    omit?: profilesOmit<ExtArgs> | null
    /**
     * Filter, which profiles to fetch.
     */
    where: profilesWhereUniqueInput
  }

  /**
   * profiles findFirst
   */
  export type profilesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the profiles
     */
    select?: profilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the profiles
     */
    omit?: profilesOmit<ExtArgs> | null
    /**
     * Filter, which profiles to fetch.
     */
    where?: profilesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of profiles to fetch.
     */
    orderBy?: profilesOrderByWithRelationInput | profilesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for profiles.
     */
    cursor?: profilesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of profiles.
     */
    distinct?: ProfilesScalarFieldEnum | ProfilesScalarFieldEnum[]
  }

  /**
   * profiles findFirstOrThrow
   */
  export type profilesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the profiles
     */
    select?: profilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the profiles
     */
    omit?: profilesOmit<ExtArgs> | null
    /**
     * Filter, which profiles to fetch.
     */
    where?: profilesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of profiles to fetch.
     */
    orderBy?: profilesOrderByWithRelationInput | profilesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for profiles.
     */
    cursor?: profilesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of profiles.
     */
    distinct?: ProfilesScalarFieldEnum | ProfilesScalarFieldEnum[]
  }

  /**
   * profiles findMany
   */
  export type profilesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the profiles
     */
    select?: profilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the profiles
     */
    omit?: profilesOmit<ExtArgs> | null
    /**
     * Filter, which profiles to fetch.
     */
    where?: profilesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of profiles to fetch.
     */
    orderBy?: profilesOrderByWithRelationInput | profilesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing profiles.
     */
    cursor?: profilesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of profiles.
     */
    distinct?: ProfilesScalarFieldEnum | ProfilesScalarFieldEnum[]
  }

  /**
   * profiles create
   */
  export type profilesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the profiles
     */
    select?: profilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the profiles
     */
    omit?: profilesOmit<ExtArgs> | null
    /**
     * The data needed to create a profiles.
     */
    data?: XOR<profilesCreateInput, profilesUncheckedCreateInput>
  }

  /**
   * profiles createMany
   */
  export type profilesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many profiles.
     */
    data: profilesCreateManyInput | profilesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * profiles createManyAndReturn
   */
  export type profilesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the profiles
     */
    select?: profilesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the profiles
     */
    omit?: profilesOmit<ExtArgs> | null
    /**
     * The data used to create many profiles.
     */
    data: profilesCreateManyInput | profilesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * profiles update
   */
  export type profilesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the profiles
     */
    select?: profilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the profiles
     */
    omit?: profilesOmit<ExtArgs> | null
    /**
     * The data needed to update a profiles.
     */
    data: XOR<profilesUpdateInput, profilesUncheckedUpdateInput>
    /**
     * Choose, which profiles to update.
     */
    where: profilesWhereUniqueInput
  }

  /**
   * profiles updateMany
   */
  export type profilesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update profiles.
     */
    data: XOR<profilesUpdateManyMutationInput, profilesUncheckedUpdateManyInput>
    /**
     * Filter which profiles to update
     */
    where?: profilesWhereInput
    /**
     * Limit how many profiles to update.
     */
    limit?: number
  }

  /**
   * profiles updateManyAndReturn
   */
  export type profilesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the profiles
     */
    select?: profilesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the profiles
     */
    omit?: profilesOmit<ExtArgs> | null
    /**
     * The data used to update profiles.
     */
    data: XOR<profilesUpdateManyMutationInput, profilesUncheckedUpdateManyInput>
    /**
     * Filter which profiles to update
     */
    where?: profilesWhereInput
    /**
     * Limit how many profiles to update.
     */
    limit?: number
  }

  /**
   * profiles upsert
   */
  export type profilesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the profiles
     */
    select?: profilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the profiles
     */
    omit?: profilesOmit<ExtArgs> | null
    /**
     * The filter to search for the profiles to update in case it exists.
     */
    where: profilesWhereUniqueInput
    /**
     * In case the profiles found by the `where` argument doesn't exist, create a new profiles with this data.
     */
    create: XOR<profilesCreateInput, profilesUncheckedCreateInput>
    /**
     * In case the profiles was found with the provided `where` argument, update it with this data.
     */
    update: XOR<profilesUpdateInput, profilesUncheckedUpdateInput>
  }

  /**
   * profiles delete
   */
  export type profilesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the profiles
     */
    select?: profilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the profiles
     */
    omit?: profilesOmit<ExtArgs> | null
    /**
     * Filter which profiles to delete.
     */
    where: profilesWhereUniqueInput
  }

  /**
   * profiles deleteMany
   */
  export type profilesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which profiles to delete
     */
    where?: profilesWhereInput
    /**
     * Limit how many profiles to delete.
     */
    limit?: number
  }

  /**
   * profiles without action
   */
  export type profilesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the profiles
     */
    select?: profilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the profiles
     */
    omit?: profilesOmit<ExtArgs> | null
  }


  /**
   * Model project
   */

  export type AggregateProject = {
    _count: ProjectCountAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  export type ProjectMinAggregateOutputType = {
    id: string | null
    title: string | null
    notion_db_id: string | null
    description: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ProjectMaxAggregateOutputType = {
    id: string | null
    title: string | null
    notion_db_id: string | null
    description: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ProjectCountAggregateOutputType = {
    id: number
    title: number
    notion_db_id: number
    description: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type ProjectMinAggregateInputType = {
    id?: true
    title?: true
    notion_db_id?: true
    description?: true
    created_at?: true
    updated_at?: true
  }

  export type ProjectMaxAggregateInputType = {
    id?: true
    title?: true
    notion_db_id?: true
    description?: true
    created_at?: true
    updated_at?: true
  }

  export type ProjectCountAggregateInputType = {
    id?: true
    title?: true
    notion_db_id?: true
    description?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type ProjectAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which project to aggregate.
     */
    where?: projectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of projects to fetch.
     */
    orderBy?: projectOrderByWithRelationInput | projectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: projectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned projects
    **/
    _count?: true | ProjectCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectMaxAggregateInputType
  }

  export type GetProjectAggregateType<T extends ProjectAggregateArgs> = {
        [P in keyof T & keyof AggregateProject]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProject[P]>
      : GetScalarType<T[P], AggregateProject[P]>
  }




  export type projectGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: projectWhereInput
    orderBy?: projectOrderByWithAggregationInput | projectOrderByWithAggregationInput[]
    by: ProjectScalarFieldEnum[] | ProjectScalarFieldEnum
    having?: projectScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectCountAggregateInputType | true
    _min?: ProjectMinAggregateInputType
    _max?: ProjectMaxAggregateInputType
  }

  export type ProjectGroupByOutputType = {
    id: string
    title: string
    notion_db_id: string
    description: string | null
    created_at: Date | null
    updated_at: Date | null
    _count: ProjectCountAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  type GetProjectGroupByPayload<T extends projectGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectGroupByOutputType[P]>
        }
      >
    >


  export type projectSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    notion_db_id?: boolean
    description?: boolean
    created_at?: boolean
    updated_at?: boolean
    task?: boolean | project$taskArgs<ExtArgs>
    workflow_status?: boolean | project$workflow_statusArgs<ExtArgs>
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type projectSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    notion_db_id?: boolean
    description?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["project"]>

  export type projectSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    notion_db_id?: boolean
    description?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["project"]>

  export type projectSelectScalar = {
    id?: boolean
    title?: boolean
    notion_db_id?: boolean
    description?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type projectOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "notion_db_id" | "description" | "created_at" | "updated_at", ExtArgs["result"]["project"]>
  export type projectInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    task?: boolean | project$taskArgs<ExtArgs>
    workflow_status?: boolean | project$workflow_statusArgs<ExtArgs>
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type projectIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type projectIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $projectPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "project"
    objects: {
      task: Prisma.$taskPayload<ExtArgs>[]
      workflow_status: Prisma.$workflow_statusPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      notion_db_id: string
      description: string | null
      created_at: Date | null
      updated_at: Date | null
    }, ExtArgs["result"]["project"]>
    composites: {}
  }

  type projectGetPayload<S extends boolean | null | undefined | projectDefaultArgs> = $Result.GetResult<Prisma.$projectPayload, S>

  type projectCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<projectFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProjectCountAggregateInputType | true
    }

  export interface projectDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['project'], meta: { name: 'project' } }
    /**
     * Find zero or one Project that matches the filter.
     * @param {projectFindUniqueArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends projectFindUniqueArgs>(args: SelectSubset<T, projectFindUniqueArgs<ExtArgs>>): Prisma__projectClient<$Result.GetResult<Prisma.$projectPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Project that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {projectFindUniqueOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends projectFindUniqueOrThrowArgs>(args: SelectSubset<T, projectFindUniqueOrThrowArgs<ExtArgs>>): Prisma__projectClient<$Result.GetResult<Prisma.$projectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Project that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {projectFindFirstArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends projectFindFirstArgs>(args?: SelectSubset<T, projectFindFirstArgs<ExtArgs>>): Prisma__projectClient<$Result.GetResult<Prisma.$projectPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Project that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {projectFindFirstOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends projectFindFirstOrThrowArgs>(args?: SelectSubset<T, projectFindFirstOrThrowArgs<ExtArgs>>): Prisma__projectClient<$Result.GetResult<Prisma.$projectPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Projects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {projectFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Projects
     * const projects = await prisma.project.findMany()
     * 
     * // Get first 10 Projects
     * const projects = await prisma.project.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectWithIdOnly = await prisma.project.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends projectFindManyArgs>(args?: SelectSubset<T, projectFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$projectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Project.
     * @param {projectCreateArgs} args - Arguments to create a Project.
     * @example
     * // Create one Project
     * const Project = await prisma.project.create({
     *   data: {
     *     // ... data to create a Project
     *   }
     * })
     * 
     */
    create<T extends projectCreateArgs>(args: SelectSubset<T, projectCreateArgs<ExtArgs>>): Prisma__projectClient<$Result.GetResult<Prisma.$projectPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Projects.
     * @param {projectCreateManyArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends projectCreateManyArgs>(args?: SelectSubset<T, projectCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Projects and returns the data saved in the database.
     * @param {projectCreateManyAndReturnArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Projects and only return the `id`
     * const projectWithIdOnly = await prisma.project.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends projectCreateManyAndReturnArgs>(args?: SelectSubset<T, projectCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$projectPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Project.
     * @param {projectDeleteArgs} args - Arguments to delete one Project.
     * @example
     * // Delete one Project
     * const Project = await prisma.project.delete({
     *   where: {
     *     // ... filter to delete one Project
     *   }
     * })
     * 
     */
    delete<T extends projectDeleteArgs>(args: SelectSubset<T, projectDeleteArgs<ExtArgs>>): Prisma__projectClient<$Result.GetResult<Prisma.$projectPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Project.
     * @param {projectUpdateArgs} args - Arguments to update one Project.
     * @example
     * // Update one Project
     * const project = await prisma.project.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends projectUpdateArgs>(args: SelectSubset<T, projectUpdateArgs<ExtArgs>>): Prisma__projectClient<$Result.GetResult<Prisma.$projectPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Projects.
     * @param {projectDeleteManyArgs} args - Arguments to filter Projects to delete.
     * @example
     * // Delete a few Projects
     * const { count } = await prisma.project.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends projectDeleteManyArgs>(args?: SelectSubset<T, projectDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {projectUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends projectUpdateManyArgs>(args: SelectSubset<T, projectUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects and returns the data updated in the database.
     * @param {projectUpdateManyAndReturnArgs} args - Arguments to update many Projects.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Projects and only return the `id`
     * const projectWithIdOnly = await prisma.project.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends projectUpdateManyAndReturnArgs>(args: SelectSubset<T, projectUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$projectPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Project.
     * @param {projectUpsertArgs} args - Arguments to update or create a Project.
     * @example
     * // Update or create a Project
     * const project = await prisma.project.upsert({
     *   create: {
     *     // ... data to create a Project
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Project we want to update
     *   }
     * })
     */
    upsert<T extends projectUpsertArgs>(args: SelectSubset<T, projectUpsertArgs<ExtArgs>>): Prisma__projectClient<$Result.GetResult<Prisma.$projectPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {projectCountArgs} args - Arguments to filter Projects to count.
     * @example
     * // Count the number of Projects
     * const count = await prisma.project.count({
     *   where: {
     *     // ... the filter for the Projects we want to count
     *   }
     * })
    **/
    count<T extends projectCountArgs>(
      args?: Subset<T, projectCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProjectAggregateArgs>(args: Subset<T, ProjectAggregateArgs>): Prisma.PrismaPromise<GetProjectAggregateType<T>>

    /**
     * Group by Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {projectGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends projectGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: projectGroupByArgs['orderBy'] }
        : { orderBy?: projectGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, projectGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the project model
   */
  readonly fields: projectFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for project.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__projectClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    task<T extends project$taskArgs<ExtArgs> = {}>(args?: Subset<T, project$taskArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$taskPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    workflow_status<T extends project$workflow_statusArgs<ExtArgs> = {}>(args?: Subset<T, project$workflow_statusArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$workflow_statusPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the project model
   */
  interface projectFieldRefs {
    readonly id: FieldRef<"project", 'String'>
    readonly title: FieldRef<"project", 'String'>
    readonly notion_db_id: FieldRef<"project", 'String'>
    readonly description: FieldRef<"project", 'String'>
    readonly created_at: FieldRef<"project", 'DateTime'>
    readonly updated_at: FieldRef<"project", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * project findUnique
   */
  export type projectFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the project
     */
    select?: projectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the project
     */
    omit?: projectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: projectInclude<ExtArgs> | null
    /**
     * Filter, which project to fetch.
     */
    where: projectWhereUniqueInput
  }

  /**
   * project findUniqueOrThrow
   */
  export type projectFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the project
     */
    select?: projectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the project
     */
    omit?: projectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: projectInclude<ExtArgs> | null
    /**
     * Filter, which project to fetch.
     */
    where: projectWhereUniqueInput
  }

  /**
   * project findFirst
   */
  export type projectFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the project
     */
    select?: projectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the project
     */
    omit?: projectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: projectInclude<ExtArgs> | null
    /**
     * Filter, which project to fetch.
     */
    where?: projectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of projects to fetch.
     */
    orderBy?: projectOrderByWithRelationInput | projectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for projects.
     */
    cursor?: projectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * project findFirstOrThrow
   */
  export type projectFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the project
     */
    select?: projectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the project
     */
    omit?: projectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: projectInclude<ExtArgs> | null
    /**
     * Filter, which project to fetch.
     */
    where?: projectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of projects to fetch.
     */
    orderBy?: projectOrderByWithRelationInput | projectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for projects.
     */
    cursor?: projectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * project findMany
   */
  export type projectFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the project
     */
    select?: projectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the project
     */
    omit?: projectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: projectInclude<ExtArgs> | null
    /**
     * Filter, which projects to fetch.
     */
    where?: projectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of projects to fetch.
     */
    orderBy?: projectOrderByWithRelationInput | projectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing projects.
     */
    cursor?: projectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * project create
   */
  export type projectCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the project
     */
    select?: projectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the project
     */
    omit?: projectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: projectInclude<ExtArgs> | null
    /**
     * The data needed to create a project.
     */
    data: XOR<projectCreateInput, projectUncheckedCreateInput>
  }

  /**
   * project createMany
   */
  export type projectCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many projects.
     */
    data: projectCreateManyInput | projectCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * project createManyAndReturn
   */
  export type projectCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the project
     */
    select?: projectSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the project
     */
    omit?: projectOmit<ExtArgs> | null
    /**
     * The data used to create many projects.
     */
    data: projectCreateManyInput | projectCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * project update
   */
  export type projectUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the project
     */
    select?: projectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the project
     */
    omit?: projectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: projectInclude<ExtArgs> | null
    /**
     * The data needed to update a project.
     */
    data: XOR<projectUpdateInput, projectUncheckedUpdateInput>
    /**
     * Choose, which project to update.
     */
    where: projectWhereUniqueInput
  }

  /**
   * project updateMany
   */
  export type projectUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update projects.
     */
    data: XOR<projectUpdateManyMutationInput, projectUncheckedUpdateManyInput>
    /**
     * Filter which projects to update
     */
    where?: projectWhereInput
    /**
     * Limit how many projects to update.
     */
    limit?: number
  }

  /**
   * project updateManyAndReturn
   */
  export type projectUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the project
     */
    select?: projectSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the project
     */
    omit?: projectOmit<ExtArgs> | null
    /**
     * The data used to update projects.
     */
    data: XOR<projectUpdateManyMutationInput, projectUncheckedUpdateManyInput>
    /**
     * Filter which projects to update
     */
    where?: projectWhereInput
    /**
     * Limit how many projects to update.
     */
    limit?: number
  }

  /**
   * project upsert
   */
  export type projectUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the project
     */
    select?: projectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the project
     */
    omit?: projectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: projectInclude<ExtArgs> | null
    /**
     * The filter to search for the project to update in case it exists.
     */
    where: projectWhereUniqueInput
    /**
     * In case the project found by the `where` argument doesn't exist, create a new project with this data.
     */
    create: XOR<projectCreateInput, projectUncheckedCreateInput>
    /**
     * In case the project was found with the provided `where` argument, update it with this data.
     */
    update: XOR<projectUpdateInput, projectUncheckedUpdateInput>
  }

  /**
   * project delete
   */
  export type projectDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the project
     */
    select?: projectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the project
     */
    omit?: projectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: projectInclude<ExtArgs> | null
    /**
     * Filter which project to delete.
     */
    where: projectWhereUniqueInput
  }

  /**
   * project deleteMany
   */
  export type projectDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which projects to delete
     */
    where?: projectWhereInput
    /**
     * Limit how many projects to delete.
     */
    limit?: number
  }

  /**
   * project.task
   */
  export type project$taskArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the task
     */
    select?: taskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the task
     */
    omit?: taskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: taskInclude<ExtArgs> | null
    where?: taskWhereInput
    orderBy?: taskOrderByWithRelationInput | taskOrderByWithRelationInput[]
    cursor?: taskWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * project.workflow_status
   */
  export type project$workflow_statusArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the workflow_status
     */
    select?: workflow_statusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the workflow_status
     */
    omit?: workflow_statusOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: workflow_statusInclude<ExtArgs> | null
    where?: workflow_statusWhereInput
    orderBy?: workflow_statusOrderByWithRelationInput | workflow_statusOrderByWithRelationInput[]
    cursor?: workflow_statusWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Workflow_statusScalarFieldEnum | Workflow_statusScalarFieldEnum[]
  }

  /**
   * project without action
   */
  export type projectDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the project
     */
    select?: projectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the project
     */
    omit?: projectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: projectInclude<ExtArgs> | null
  }


  /**
   * Model sync_log
   */

  export type AggregateSync_log = {
    _count: Sync_logCountAggregateOutputType | null
    _avg: Sync_logAvgAggregateOutputType | null
    _sum: Sync_logSumAggregateOutputType | null
    _min: Sync_logMinAggregateOutputType | null
    _max: Sync_logMaxAggregateOutputType | null
  }

  export type Sync_logAvgAggregateOutputType = {
    id: number | null
    retry_count: number | null
  }

  export type Sync_logSumAggregateOutputType = {
    id: bigint | null
    retry_count: number | null
  }

  export type Sync_logMinAggregateOutputType = {
    id: bigint | null
    task_id: string | null
    direction: string | null
    sync_status: string | null
    error_message: string | null
    retry_count: number | null
    synced_at: Date | null
  }

  export type Sync_logMaxAggregateOutputType = {
    id: bigint | null
    task_id: string | null
    direction: string | null
    sync_status: string | null
    error_message: string | null
    retry_count: number | null
    synced_at: Date | null
  }

  export type Sync_logCountAggregateOutputType = {
    id: number
    task_id: number
    direction: number
    sync_status: number
    error_message: number
    retry_count: number
    synced_at: number
    _all: number
  }


  export type Sync_logAvgAggregateInputType = {
    id?: true
    retry_count?: true
  }

  export type Sync_logSumAggregateInputType = {
    id?: true
    retry_count?: true
  }

  export type Sync_logMinAggregateInputType = {
    id?: true
    task_id?: true
    direction?: true
    sync_status?: true
    error_message?: true
    retry_count?: true
    synced_at?: true
  }

  export type Sync_logMaxAggregateInputType = {
    id?: true
    task_id?: true
    direction?: true
    sync_status?: true
    error_message?: true
    retry_count?: true
    synced_at?: true
  }

  export type Sync_logCountAggregateInputType = {
    id?: true
    task_id?: true
    direction?: true
    sync_status?: true
    error_message?: true
    retry_count?: true
    synced_at?: true
    _all?: true
  }

  export type Sync_logAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which sync_log to aggregate.
     */
    where?: sync_logWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sync_logs to fetch.
     */
    orderBy?: sync_logOrderByWithRelationInput | sync_logOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: sync_logWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sync_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sync_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned sync_logs
    **/
    _count?: true | Sync_logCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Sync_logAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Sync_logSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Sync_logMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Sync_logMaxAggregateInputType
  }

  export type GetSync_logAggregateType<T extends Sync_logAggregateArgs> = {
        [P in keyof T & keyof AggregateSync_log]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSync_log[P]>
      : GetScalarType<T[P], AggregateSync_log[P]>
  }




  export type sync_logGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: sync_logWhereInput
    orderBy?: sync_logOrderByWithAggregationInput | sync_logOrderByWithAggregationInput[]
    by: Sync_logScalarFieldEnum[] | Sync_logScalarFieldEnum
    having?: sync_logScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Sync_logCountAggregateInputType | true
    _avg?: Sync_logAvgAggregateInputType
    _sum?: Sync_logSumAggregateInputType
    _min?: Sync_logMinAggregateInputType
    _max?: Sync_logMaxAggregateInputType
  }

  export type Sync_logGroupByOutputType = {
    id: bigint
    task_id: string
    direction: string | null
    sync_status: string | null
    error_message: string | null
    retry_count: number | null
    synced_at: Date
    _count: Sync_logCountAggregateOutputType | null
    _avg: Sync_logAvgAggregateOutputType | null
    _sum: Sync_logSumAggregateOutputType | null
    _min: Sync_logMinAggregateOutputType | null
    _max: Sync_logMaxAggregateOutputType | null
  }

  type GetSync_logGroupByPayload<T extends sync_logGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Sync_logGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Sync_logGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Sync_logGroupByOutputType[P]>
            : GetScalarType<T[P], Sync_logGroupByOutputType[P]>
        }
      >
    >


  export type sync_logSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    task_id?: boolean
    direction?: boolean
    sync_status?: boolean
    error_message?: boolean
    retry_count?: boolean
    synced_at?: boolean
    task?: boolean | taskDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sync_log"]>

  export type sync_logSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    task_id?: boolean
    direction?: boolean
    sync_status?: boolean
    error_message?: boolean
    retry_count?: boolean
    synced_at?: boolean
    task?: boolean | taskDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sync_log"]>

  export type sync_logSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    task_id?: boolean
    direction?: boolean
    sync_status?: boolean
    error_message?: boolean
    retry_count?: boolean
    synced_at?: boolean
    task?: boolean | taskDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sync_log"]>

  export type sync_logSelectScalar = {
    id?: boolean
    task_id?: boolean
    direction?: boolean
    sync_status?: boolean
    error_message?: boolean
    retry_count?: boolean
    synced_at?: boolean
  }

  export type sync_logOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "task_id" | "direction" | "sync_status" | "error_message" | "retry_count" | "synced_at", ExtArgs["result"]["sync_log"]>
  export type sync_logInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    task?: boolean | taskDefaultArgs<ExtArgs>
  }
  export type sync_logIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    task?: boolean | taskDefaultArgs<ExtArgs>
  }
  export type sync_logIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    task?: boolean | taskDefaultArgs<ExtArgs>
  }

  export type $sync_logPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "sync_log"
    objects: {
      task: Prisma.$taskPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      task_id: string
      direction: string | null
      sync_status: string | null
      error_message: string | null
      retry_count: number | null
      synced_at: Date
    }, ExtArgs["result"]["sync_log"]>
    composites: {}
  }

  type sync_logGetPayload<S extends boolean | null | undefined | sync_logDefaultArgs> = $Result.GetResult<Prisma.$sync_logPayload, S>

  type sync_logCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<sync_logFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Sync_logCountAggregateInputType | true
    }

  export interface sync_logDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['sync_log'], meta: { name: 'sync_log' } }
    /**
     * Find zero or one Sync_log that matches the filter.
     * @param {sync_logFindUniqueArgs} args - Arguments to find a Sync_log
     * @example
     * // Get one Sync_log
     * const sync_log = await prisma.sync_log.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends sync_logFindUniqueArgs>(args: SelectSubset<T, sync_logFindUniqueArgs<ExtArgs>>): Prisma__sync_logClient<$Result.GetResult<Prisma.$sync_logPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Sync_log that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {sync_logFindUniqueOrThrowArgs} args - Arguments to find a Sync_log
     * @example
     * // Get one Sync_log
     * const sync_log = await prisma.sync_log.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends sync_logFindUniqueOrThrowArgs>(args: SelectSubset<T, sync_logFindUniqueOrThrowArgs<ExtArgs>>): Prisma__sync_logClient<$Result.GetResult<Prisma.$sync_logPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Sync_log that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sync_logFindFirstArgs} args - Arguments to find a Sync_log
     * @example
     * // Get one Sync_log
     * const sync_log = await prisma.sync_log.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends sync_logFindFirstArgs>(args?: SelectSubset<T, sync_logFindFirstArgs<ExtArgs>>): Prisma__sync_logClient<$Result.GetResult<Prisma.$sync_logPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Sync_log that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sync_logFindFirstOrThrowArgs} args - Arguments to find a Sync_log
     * @example
     * // Get one Sync_log
     * const sync_log = await prisma.sync_log.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends sync_logFindFirstOrThrowArgs>(args?: SelectSubset<T, sync_logFindFirstOrThrowArgs<ExtArgs>>): Prisma__sync_logClient<$Result.GetResult<Prisma.$sync_logPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sync_logs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sync_logFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sync_logs
     * const sync_logs = await prisma.sync_log.findMany()
     * 
     * // Get first 10 Sync_logs
     * const sync_logs = await prisma.sync_log.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sync_logWithIdOnly = await prisma.sync_log.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends sync_logFindManyArgs>(args?: SelectSubset<T, sync_logFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$sync_logPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Sync_log.
     * @param {sync_logCreateArgs} args - Arguments to create a Sync_log.
     * @example
     * // Create one Sync_log
     * const Sync_log = await prisma.sync_log.create({
     *   data: {
     *     // ... data to create a Sync_log
     *   }
     * })
     * 
     */
    create<T extends sync_logCreateArgs>(args: SelectSubset<T, sync_logCreateArgs<ExtArgs>>): Prisma__sync_logClient<$Result.GetResult<Prisma.$sync_logPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sync_logs.
     * @param {sync_logCreateManyArgs} args - Arguments to create many Sync_logs.
     * @example
     * // Create many Sync_logs
     * const sync_log = await prisma.sync_log.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends sync_logCreateManyArgs>(args?: SelectSubset<T, sync_logCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sync_logs and returns the data saved in the database.
     * @param {sync_logCreateManyAndReturnArgs} args - Arguments to create many Sync_logs.
     * @example
     * // Create many Sync_logs
     * const sync_log = await prisma.sync_log.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sync_logs and only return the `id`
     * const sync_logWithIdOnly = await prisma.sync_log.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends sync_logCreateManyAndReturnArgs>(args?: SelectSubset<T, sync_logCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$sync_logPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Sync_log.
     * @param {sync_logDeleteArgs} args - Arguments to delete one Sync_log.
     * @example
     * // Delete one Sync_log
     * const Sync_log = await prisma.sync_log.delete({
     *   where: {
     *     // ... filter to delete one Sync_log
     *   }
     * })
     * 
     */
    delete<T extends sync_logDeleteArgs>(args: SelectSubset<T, sync_logDeleteArgs<ExtArgs>>): Prisma__sync_logClient<$Result.GetResult<Prisma.$sync_logPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Sync_log.
     * @param {sync_logUpdateArgs} args - Arguments to update one Sync_log.
     * @example
     * // Update one Sync_log
     * const sync_log = await prisma.sync_log.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends sync_logUpdateArgs>(args: SelectSubset<T, sync_logUpdateArgs<ExtArgs>>): Prisma__sync_logClient<$Result.GetResult<Prisma.$sync_logPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sync_logs.
     * @param {sync_logDeleteManyArgs} args - Arguments to filter Sync_logs to delete.
     * @example
     * // Delete a few Sync_logs
     * const { count } = await prisma.sync_log.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends sync_logDeleteManyArgs>(args?: SelectSubset<T, sync_logDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sync_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sync_logUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sync_logs
     * const sync_log = await prisma.sync_log.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends sync_logUpdateManyArgs>(args: SelectSubset<T, sync_logUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sync_logs and returns the data updated in the database.
     * @param {sync_logUpdateManyAndReturnArgs} args - Arguments to update many Sync_logs.
     * @example
     * // Update many Sync_logs
     * const sync_log = await prisma.sync_log.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sync_logs and only return the `id`
     * const sync_logWithIdOnly = await prisma.sync_log.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends sync_logUpdateManyAndReturnArgs>(args: SelectSubset<T, sync_logUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$sync_logPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Sync_log.
     * @param {sync_logUpsertArgs} args - Arguments to update or create a Sync_log.
     * @example
     * // Update or create a Sync_log
     * const sync_log = await prisma.sync_log.upsert({
     *   create: {
     *     // ... data to create a Sync_log
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Sync_log we want to update
     *   }
     * })
     */
    upsert<T extends sync_logUpsertArgs>(args: SelectSubset<T, sync_logUpsertArgs<ExtArgs>>): Prisma__sync_logClient<$Result.GetResult<Prisma.$sync_logPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sync_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sync_logCountArgs} args - Arguments to filter Sync_logs to count.
     * @example
     * // Count the number of Sync_logs
     * const count = await prisma.sync_log.count({
     *   where: {
     *     // ... the filter for the Sync_logs we want to count
     *   }
     * })
    **/
    count<T extends sync_logCountArgs>(
      args?: Subset<T, sync_logCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Sync_logCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Sync_log.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Sync_logAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Sync_logAggregateArgs>(args: Subset<T, Sync_logAggregateArgs>): Prisma.PrismaPromise<GetSync_logAggregateType<T>>

    /**
     * Group by Sync_log.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sync_logGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends sync_logGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: sync_logGroupByArgs['orderBy'] }
        : { orderBy?: sync_logGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, sync_logGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSync_logGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the sync_log model
   */
  readonly fields: sync_logFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for sync_log.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__sync_logClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    task<T extends taskDefaultArgs<ExtArgs> = {}>(args?: Subset<T, taskDefaultArgs<ExtArgs>>): Prisma__taskClient<$Result.GetResult<Prisma.$taskPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the sync_log model
   */
  interface sync_logFieldRefs {
    readonly id: FieldRef<"sync_log", 'BigInt'>
    readonly task_id: FieldRef<"sync_log", 'String'>
    readonly direction: FieldRef<"sync_log", 'String'>
    readonly sync_status: FieldRef<"sync_log", 'String'>
    readonly error_message: FieldRef<"sync_log", 'String'>
    readonly retry_count: FieldRef<"sync_log", 'Int'>
    readonly synced_at: FieldRef<"sync_log", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * sync_log findUnique
   */
  export type sync_logFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sync_log
     */
    select?: sync_logSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sync_log
     */
    omit?: sync_logOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sync_logInclude<ExtArgs> | null
    /**
     * Filter, which sync_log to fetch.
     */
    where: sync_logWhereUniqueInput
  }

  /**
   * sync_log findUniqueOrThrow
   */
  export type sync_logFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sync_log
     */
    select?: sync_logSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sync_log
     */
    omit?: sync_logOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sync_logInclude<ExtArgs> | null
    /**
     * Filter, which sync_log to fetch.
     */
    where: sync_logWhereUniqueInput
  }

  /**
   * sync_log findFirst
   */
  export type sync_logFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sync_log
     */
    select?: sync_logSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sync_log
     */
    omit?: sync_logOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sync_logInclude<ExtArgs> | null
    /**
     * Filter, which sync_log to fetch.
     */
    where?: sync_logWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sync_logs to fetch.
     */
    orderBy?: sync_logOrderByWithRelationInput | sync_logOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for sync_logs.
     */
    cursor?: sync_logWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sync_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sync_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of sync_logs.
     */
    distinct?: Sync_logScalarFieldEnum | Sync_logScalarFieldEnum[]
  }

  /**
   * sync_log findFirstOrThrow
   */
  export type sync_logFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sync_log
     */
    select?: sync_logSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sync_log
     */
    omit?: sync_logOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sync_logInclude<ExtArgs> | null
    /**
     * Filter, which sync_log to fetch.
     */
    where?: sync_logWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sync_logs to fetch.
     */
    orderBy?: sync_logOrderByWithRelationInput | sync_logOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for sync_logs.
     */
    cursor?: sync_logWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sync_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sync_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of sync_logs.
     */
    distinct?: Sync_logScalarFieldEnum | Sync_logScalarFieldEnum[]
  }

  /**
   * sync_log findMany
   */
  export type sync_logFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sync_log
     */
    select?: sync_logSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sync_log
     */
    omit?: sync_logOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sync_logInclude<ExtArgs> | null
    /**
     * Filter, which sync_logs to fetch.
     */
    where?: sync_logWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sync_logs to fetch.
     */
    orderBy?: sync_logOrderByWithRelationInput | sync_logOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing sync_logs.
     */
    cursor?: sync_logWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sync_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sync_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of sync_logs.
     */
    distinct?: Sync_logScalarFieldEnum | Sync_logScalarFieldEnum[]
  }

  /**
   * sync_log create
   */
  export type sync_logCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sync_log
     */
    select?: sync_logSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sync_log
     */
    omit?: sync_logOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sync_logInclude<ExtArgs> | null
    /**
     * The data needed to create a sync_log.
     */
    data: XOR<sync_logCreateInput, sync_logUncheckedCreateInput>
  }

  /**
   * sync_log createMany
   */
  export type sync_logCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many sync_logs.
     */
    data: sync_logCreateManyInput | sync_logCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * sync_log createManyAndReturn
   */
  export type sync_logCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sync_log
     */
    select?: sync_logSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the sync_log
     */
    omit?: sync_logOmit<ExtArgs> | null
    /**
     * The data used to create many sync_logs.
     */
    data: sync_logCreateManyInput | sync_logCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sync_logIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * sync_log update
   */
  export type sync_logUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sync_log
     */
    select?: sync_logSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sync_log
     */
    omit?: sync_logOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sync_logInclude<ExtArgs> | null
    /**
     * The data needed to update a sync_log.
     */
    data: XOR<sync_logUpdateInput, sync_logUncheckedUpdateInput>
    /**
     * Choose, which sync_log to update.
     */
    where: sync_logWhereUniqueInput
  }

  /**
   * sync_log updateMany
   */
  export type sync_logUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update sync_logs.
     */
    data: XOR<sync_logUpdateManyMutationInput, sync_logUncheckedUpdateManyInput>
    /**
     * Filter which sync_logs to update
     */
    where?: sync_logWhereInput
    /**
     * Limit how many sync_logs to update.
     */
    limit?: number
  }

  /**
   * sync_log updateManyAndReturn
   */
  export type sync_logUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sync_log
     */
    select?: sync_logSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the sync_log
     */
    omit?: sync_logOmit<ExtArgs> | null
    /**
     * The data used to update sync_logs.
     */
    data: XOR<sync_logUpdateManyMutationInput, sync_logUncheckedUpdateManyInput>
    /**
     * Filter which sync_logs to update
     */
    where?: sync_logWhereInput
    /**
     * Limit how many sync_logs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sync_logIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * sync_log upsert
   */
  export type sync_logUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sync_log
     */
    select?: sync_logSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sync_log
     */
    omit?: sync_logOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sync_logInclude<ExtArgs> | null
    /**
     * The filter to search for the sync_log to update in case it exists.
     */
    where: sync_logWhereUniqueInput
    /**
     * In case the sync_log found by the `where` argument doesn't exist, create a new sync_log with this data.
     */
    create: XOR<sync_logCreateInput, sync_logUncheckedCreateInput>
    /**
     * In case the sync_log was found with the provided `where` argument, update it with this data.
     */
    update: XOR<sync_logUpdateInput, sync_logUncheckedUpdateInput>
  }

  /**
   * sync_log delete
   */
  export type sync_logDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sync_log
     */
    select?: sync_logSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sync_log
     */
    omit?: sync_logOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sync_logInclude<ExtArgs> | null
    /**
     * Filter which sync_log to delete.
     */
    where: sync_logWhereUniqueInput
  }

  /**
   * sync_log deleteMany
   */
  export type sync_logDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which sync_logs to delete
     */
    where?: sync_logWhereInput
    /**
     * Limit how many sync_logs to delete.
     */
    limit?: number
  }

  /**
   * sync_log without action
   */
  export type sync_logDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sync_log
     */
    select?: sync_logSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sync_log
     */
    omit?: sync_logOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sync_logInclude<ExtArgs> | null
  }


  /**
   * Model task
   */

  export type AggregateTask = {
    _count: TaskCountAggregateOutputType | null
    _min: TaskMinAggregateOutputType | null
    _max: TaskMaxAggregateOutputType | null
  }

  export type TaskMinAggregateOutputType = {
    id: string | null
    project_id: string | null
    status_id: string | null
    notion_page_id: string | null
    title: string | null
    deleted_at: Date | null
    content: string | null
    start_date: Date | null
    end_date: Date | null
    priority: string | null
    tags: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type TaskMaxAggregateOutputType = {
    id: string | null
    project_id: string | null
    status_id: string | null
    notion_page_id: string | null
    title: string | null
    deleted_at: Date | null
    content: string | null
    start_date: Date | null
    end_date: Date | null
    priority: string | null
    tags: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type TaskCountAggregateOutputType = {
    id: number
    project_id: number
    status_id: number
    notion_page_id: number
    title: number
    deleted_at: number
    content: number
    start_date: number
    end_date: number
    priority: number
    assignees: number
    tags: number
    raw_notion_data: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type TaskMinAggregateInputType = {
    id?: true
    project_id?: true
    status_id?: true
    notion_page_id?: true
    title?: true
    deleted_at?: true
    content?: true
    start_date?: true
    end_date?: true
    priority?: true
    tags?: true
    created_at?: true
    updated_at?: true
  }

  export type TaskMaxAggregateInputType = {
    id?: true
    project_id?: true
    status_id?: true
    notion_page_id?: true
    title?: true
    deleted_at?: true
    content?: true
    start_date?: true
    end_date?: true
    priority?: true
    tags?: true
    created_at?: true
    updated_at?: true
  }

  export type TaskCountAggregateInputType = {
    id?: true
    project_id?: true
    status_id?: true
    notion_page_id?: true
    title?: true
    deleted_at?: true
    content?: true
    start_date?: true
    end_date?: true
    priority?: true
    assignees?: true
    tags?: true
    raw_notion_data?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type TaskAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which task to aggregate.
     */
    where?: taskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tasks to fetch.
     */
    orderBy?: taskOrderByWithRelationInput | taskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: taskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned tasks
    **/
    _count?: true | TaskCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TaskMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TaskMaxAggregateInputType
  }

  export type GetTaskAggregateType<T extends TaskAggregateArgs> = {
        [P in keyof T & keyof AggregateTask]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTask[P]>
      : GetScalarType<T[P], AggregateTask[P]>
  }




  export type taskGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: taskWhereInput
    orderBy?: taskOrderByWithAggregationInput | taskOrderByWithAggregationInput[]
    by: TaskScalarFieldEnum[] | TaskScalarFieldEnum
    having?: taskScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TaskCountAggregateInputType | true
    _min?: TaskMinAggregateInputType
    _max?: TaskMaxAggregateInputType
  }

  export type TaskGroupByOutputType = {
    id: string
    project_id: string | null
    status_id: string | null
    notion_page_id: string | null
    title: string
    deleted_at: Date | null
    content: string | null
    start_date: Date | null
    end_date: Date | null
    priority: string | null
    assignees: JsonValue | null
    tags: string | null
    raw_notion_data: JsonValue | null
    created_at: Date | null
    updated_at: Date | null
    _count: TaskCountAggregateOutputType | null
    _min: TaskMinAggregateOutputType | null
    _max: TaskMaxAggregateOutputType | null
  }

  type GetTaskGroupByPayload<T extends taskGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TaskGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TaskGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TaskGroupByOutputType[P]>
            : GetScalarType<T[P], TaskGroupByOutputType[P]>
        }
      >
    >


  export type taskSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    project_id?: boolean
    status_id?: boolean
    notion_page_id?: boolean
    title?: boolean
    deleted_at?: boolean
    content?: boolean
    start_date?: boolean
    end_date?: boolean
    priority?: boolean
    assignees?: boolean
    tags?: boolean
    raw_notion_data?: boolean
    created_at?: boolean
    updated_at?: boolean
    sync_log?: boolean | task$sync_logArgs<ExtArgs>
    project?: boolean | task$projectArgs<ExtArgs>
    workflow_status?: boolean | task$workflow_statusArgs<ExtArgs>
    _count?: boolean | TaskCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["task"]>

  export type taskSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    project_id?: boolean
    status_id?: boolean
    notion_page_id?: boolean
    title?: boolean
    deleted_at?: boolean
    content?: boolean
    start_date?: boolean
    end_date?: boolean
    priority?: boolean
    assignees?: boolean
    tags?: boolean
    raw_notion_data?: boolean
    created_at?: boolean
    updated_at?: boolean
    project?: boolean | task$projectArgs<ExtArgs>
    workflow_status?: boolean | task$workflow_statusArgs<ExtArgs>
  }, ExtArgs["result"]["task"]>

  export type taskSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    project_id?: boolean
    status_id?: boolean
    notion_page_id?: boolean
    title?: boolean
    deleted_at?: boolean
    content?: boolean
    start_date?: boolean
    end_date?: boolean
    priority?: boolean
    assignees?: boolean
    tags?: boolean
    raw_notion_data?: boolean
    created_at?: boolean
    updated_at?: boolean
    project?: boolean | task$projectArgs<ExtArgs>
    workflow_status?: boolean | task$workflow_statusArgs<ExtArgs>
  }, ExtArgs["result"]["task"]>

  export type taskSelectScalar = {
    id?: boolean
    project_id?: boolean
    status_id?: boolean
    notion_page_id?: boolean
    title?: boolean
    deleted_at?: boolean
    content?: boolean
    start_date?: boolean
    end_date?: boolean
    priority?: boolean
    assignees?: boolean
    tags?: boolean
    raw_notion_data?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type taskOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "project_id" | "status_id" | "notion_page_id" | "title" | "deleted_at" | "content" | "start_date" | "end_date" | "priority" | "assignees" | "tags" | "raw_notion_data" | "created_at" | "updated_at", ExtArgs["result"]["task"]>
  export type taskInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sync_log?: boolean | task$sync_logArgs<ExtArgs>
    project?: boolean | task$projectArgs<ExtArgs>
    workflow_status?: boolean | task$workflow_statusArgs<ExtArgs>
    _count?: boolean | TaskCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type taskIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | task$projectArgs<ExtArgs>
    workflow_status?: boolean | task$workflow_statusArgs<ExtArgs>
  }
  export type taskIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | task$projectArgs<ExtArgs>
    workflow_status?: boolean | task$workflow_statusArgs<ExtArgs>
  }

  export type $taskPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "task"
    objects: {
      sync_log: Prisma.$sync_logPayload<ExtArgs>[]
      project: Prisma.$projectPayload<ExtArgs> | null
      workflow_status: Prisma.$workflow_statusPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      project_id: string | null
      status_id: string | null
      notion_page_id: string | null
      title: string
      deleted_at: Date | null
      content: string | null
      start_date: Date | null
      end_date: Date | null
      priority: string | null
      assignees: Prisma.JsonValue | null
      tags: string | null
      raw_notion_data: Prisma.JsonValue | null
      created_at: Date | null
      updated_at: Date | null
    }, ExtArgs["result"]["task"]>
    composites: {}
  }

  type taskGetPayload<S extends boolean | null | undefined | taskDefaultArgs> = $Result.GetResult<Prisma.$taskPayload, S>

  type taskCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<taskFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TaskCountAggregateInputType | true
    }

  export interface taskDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['task'], meta: { name: 'task' } }
    /**
     * Find zero or one Task that matches the filter.
     * @param {taskFindUniqueArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends taskFindUniqueArgs>(args: SelectSubset<T, taskFindUniqueArgs<ExtArgs>>): Prisma__taskClient<$Result.GetResult<Prisma.$taskPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Task that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {taskFindUniqueOrThrowArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends taskFindUniqueOrThrowArgs>(args: SelectSubset<T, taskFindUniqueOrThrowArgs<ExtArgs>>): Prisma__taskClient<$Result.GetResult<Prisma.$taskPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Task that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {taskFindFirstArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends taskFindFirstArgs>(args?: SelectSubset<T, taskFindFirstArgs<ExtArgs>>): Prisma__taskClient<$Result.GetResult<Prisma.$taskPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Task that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {taskFindFirstOrThrowArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends taskFindFirstOrThrowArgs>(args?: SelectSubset<T, taskFindFirstOrThrowArgs<ExtArgs>>): Prisma__taskClient<$Result.GetResult<Prisma.$taskPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tasks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {taskFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tasks
     * const tasks = await prisma.task.findMany()
     * 
     * // Get first 10 Tasks
     * const tasks = await prisma.task.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const taskWithIdOnly = await prisma.task.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends taskFindManyArgs>(args?: SelectSubset<T, taskFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$taskPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Task.
     * @param {taskCreateArgs} args - Arguments to create a Task.
     * @example
     * // Create one Task
     * const Task = await prisma.task.create({
     *   data: {
     *     // ... data to create a Task
     *   }
     * })
     * 
     */
    create<T extends taskCreateArgs>(args: SelectSubset<T, taskCreateArgs<ExtArgs>>): Prisma__taskClient<$Result.GetResult<Prisma.$taskPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tasks.
     * @param {taskCreateManyArgs} args - Arguments to create many Tasks.
     * @example
     * // Create many Tasks
     * const task = await prisma.task.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends taskCreateManyArgs>(args?: SelectSubset<T, taskCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tasks and returns the data saved in the database.
     * @param {taskCreateManyAndReturnArgs} args - Arguments to create many Tasks.
     * @example
     * // Create many Tasks
     * const task = await prisma.task.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tasks and only return the `id`
     * const taskWithIdOnly = await prisma.task.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends taskCreateManyAndReturnArgs>(args?: SelectSubset<T, taskCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$taskPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Task.
     * @param {taskDeleteArgs} args - Arguments to delete one Task.
     * @example
     * // Delete one Task
     * const Task = await prisma.task.delete({
     *   where: {
     *     // ... filter to delete one Task
     *   }
     * })
     * 
     */
    delete<T extends taskDeleteArgs>(args: SelectSubset<T, taskDeleteArgs<ExtArgs>>): Prisma__taskClient<$Result.GetResult<Prisma.$taskPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Task.
     * @param {taskUpdateArgs} args - Arguments to update one Task.
     * @example
     * // Update one Task
     * const task = await prisma.task.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends taskUpdateArgs>(args: SelectSubset<T, taskUpdateArgs<ExtArgs>>): Prisma__taskClient<$Result.GetResult<Prisma.$taskPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tasks.
     * @param {taskDeleteManyArgs} args - Arguments to filter Tasks to delete.
     * @example
     * // Delete a few Tasks
     * const { count } = await prisma.task.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends taskDeleteManyArgs>(args?: SelectSubset<T, taskDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {taskUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tasks
     * const task = await prisma.task.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends taskUpdateManyArgs>(args: SelectSubset<T, taskUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tasks and returns the data updated in the database.
     * @param {taskUpdateManyAndReturnArgs} args - Arguments to update many Tasks.
     * @example
     * // Update many Tasks
     * const task = await prisma.task.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Tasks and only return the `id`
     * const taskWithIdOnly = await prisma.task.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends taskUpdateManyAndReturnArgs>(args: SelectSubset<T, taskUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$taskPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Task.
     * @param {taskUpsertArgs} args - Arguments to update or create a Task.
     * @example
     * // Update or create a Task
     * const task = await prisma.task.upsert({
     *   create: {
     *     // ... data to create a Task
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Task we want to update
     *   }
     * })
     */
    upsert<T extends taskUpsertArgs>(args: SelectSubset<T, taskUpsertArgs<ExtArgs>>): Prisma__taskClient<$Result.GetResult<Prisma.$taskPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {taskCountArgs} args - Arguments to filter Tasks to count.
     * @example
     * // Count the number of Tasks
     * const count = await prisma.task.count({
     *   where: {
     *     // ... the filter for the Tasks we want to count
     *   }
     * })
    **/
    count<T extends taskCountArgs>(
      args?: Subset<T, taskCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TaskCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Task.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TaskAggregateArgs>(args: Subset<T, TaskAggregateArgs>): Prisma.PrismaPromise<GetTaskAggregateType<T>>

    /**
     * Group by Task.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {taskGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends taskGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: taskGroupByArgs['orderBy'] }
        : { orderBy?: taskGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, taskGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTaskGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the task model
   */
  readonly fields: taskFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for task.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__taskClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sync_log<T extends task$sync_logArgs<ExtArgs> = {}>(args?: Subset<T, task$sync_logArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$sync_logPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    project<T extends task$projectArgs<ExtArgs> = {}>(args?: Subset<T, task$projectArgs<ExtArgs>>): Prisma__projectClient<$Result.GetResult<Prisma.$projectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    workflow_status<T extends task$workflow_statusArgs<ExtArgs> = {}>(args?: Subset<T, task$workflow_statusArgs<ExtArgs>>): Prisma__workflow_statusClient<$Result.GetResult<Prisma.$workflow_statusPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the task model
   */
  interface taskFieldRefs {
    readonly id: FieldRef<"task", 'String'>
    readonly project_id: FieldRef<"task", 'String'>
    readonly status_id: FieldRef<"task", 'String'>
    readonly notion_page_id: FieldRef<"task", 'String'>
    readonly title: FieldRef<"task", 'String'>
    readonly deleted_at: FieldRef<"task", 'DateTime'>
    readonly content: FieldRef<"task", 'String'>
    readonly start_date: FieldRef<"task", 'DateTime'>
    readonly end_date: FieldRef<"task", 'DateTime'>
    readonly priority: FieldRef<"task", 'String'>
    readonly assignees: FieldRef<"task", 'Json'>
    readonly tags: FieldRef<"task", 'String'>
    readonly raw_notion_data: FieldRef<"task", 'Json'>
    readonly created_at: FieldRef<"task", 'DateTime'>
    readonly updated_at: FieldRef<"task", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * task findUnique
   */
  export type taskFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the task
     */
    select?: taskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the task
     */
    omit?: taskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: taskInclude<ExtArgs> | null
    /**
     * Filter, which task to fetch.
     */
    where: taskWhereUniqueInput
  }

  /**
   * task findUniqueOrThrow
   */
  export type taskFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the task
     */
    select?: taskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the task
     */
    omit?: taskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: taskInclude<ExtArgs> | null
    /**
     * Filter, which task to fetch.
     */
    where: taskWhereUniqueInput
  }

  /**
   * task findFirst
   */
  export type taskFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the task
     */
    select?: taskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the task
     */
    omit?: taskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: taskInclude<ExtArgs> | null
    /**
     * Filter, which task to fetch.
     */
    where?: taskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tasks to fetch.
     */
    orderBy?: taskOrderByWithRelationInput | taskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for tasks.
     */
    cursor?: taskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of tasks.
     */
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * task findFirstOrThrow
   */
  export type taskFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the task
     */
    select?: taskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the task
     */
    omit?: taskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: taskInclude<ExtArgs> | null
    /**
     * Filter, which task to fetch.
     */
    where?: taskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tasks to fetch.
     */
    orderBy?: taskOrderByWithRelationInput | taskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for tasks.
     */
    cursor?: taskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of tasks.
     */
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * task findMany
   */
  export type taskFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the task
     */
    select?: taskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the task
     */
    omit?: taskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: taskInclude<ExtArgs> | null
    /**
     * Filter, which tasks to fetch.
     */
    where?: taskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tasks to fetch.
     */
    orderBy?: taskOrderByWithRelationInput | taskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing tasks.
     */
    cursor?: taskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of tasks.
     */
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * task create
   */
  export type taskCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the task
     */
    select?: taskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the task
     */
    omit?: taskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: taskInclude<ExtArgs> | null
    /**
     * The data needed to create a task.
     */
    data: XOR<taskCreateInput, taskUncheckedCreateInput>
  }

  /**
   * task createMany
   */
  export type taskCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many tasks.
     */
    data: taskCreateManyInput | taskCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * task createManyAndReturn
   */
  export type taskCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the task
     */
    select?: taskSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the task
     */
    omit?: taskOmit<ExtArgs> | null
    /**
     * The data used to create many tasks.
     */
    data: taskCreateManyInput | taskCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: taskIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * task update
   */
  export type taskUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the task
     */
    select?: taskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the task
     */
    omit?: taskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: taskInclude<ExtArgs> | null
    /**
     * The data needed to update a task.
     */
    data: XOR<taskUpdateInput, taskUncheckedUpdateInput>
    /**
     * Choose, which task to update.
     */
    where: taskWhereUniqueInput
  }

  /**
   * task updateMany
   */
  export type taskUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update tasks.
     */
    data: XOR<taskUpdateManyMutationInput, taskUncheckedUpdateManyInput>
    /**
     * Filter which tasks to update
     */
    where?: taskWhereInput
    /**
     * Limit how many tasks to update.
     */
    limit?: number
  }

  /**
   * task updateManyAndReturn
   */
  export type taskUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the task
     */
    select?: taskSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the task
     */
    omit?: taskOmit<ExtArgs> | null
    /**
     * The data used to update tasks.
     */
    data: XOR<taskUpdateManyMutationInput, taskUncheckedUpdateManyInput>
    /**
     * Filter which tasks to update
     */
    where?: taskWhereInput
    /**
     * Limit how many tasks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: taskIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * task upsert
   */
  export type taskUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the task
     */
    select?: taskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the task
     */
    omit?: taskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: taskInclude<ExtArgs> | null
    /**
     * The filter to search for the task to update in case it exists.
     */
    where: taskWhereUniqueInput
    /**
     * In case the task found by the `where` argument doesn't exist, create a new task with this data.
     */
    create: XOR<taskCreateInput, taskUncheckedCreateInput>
    /**
     * In case the task was found with the provided `where` argument, update it with this data.
     */
    update: XOR<taskUpdateInput, taskUncheckedUpdateInput>
  }

  /**
   * task delete
   */
  export type taskDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the task
     */
    select?: taskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the task
     */
    omit?: taskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: taskInclude<ExtArgs> | null
    /**
     * Filter which task to delete.
     */
    where: taskWhereUniqueInput
  }

  /**
   * task deleteMany
   */
  export type taskDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which tasks to delete
     */
    where?: taskWhereInput
    /**
     * Limit how many tasks to delete.
     */
    limit?: number
  }

  /**
   * task.sync_log
   */
  export type task$sync_logArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sync_log
     */
    select?: sync_logSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sync_log
     */
    omit?: sync_logOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sync_logInclude<ExtArgs> | null
    where?: sync_logWhereInput
    orderBy?: sync_logOrderByWithRelationInput | sync_logOrderByWithRelationInput[]
    cursor?: sync_logWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Sync_logScalarFieldEnum | Sync_logScalarFieldEnum[]
  }

  /**
   * task.project
   */
  export type task$projectArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the project
     */
    select?: projectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the project
     */
    omit?: projectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: projectInclude<ExtArgs> | null
    where?: projectWhereInput
  }

  /**
   * task.workflow_status
   */
  export type task$workflow_statusArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the workflow_status
     */
    select?: workflow_statusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the workflow_status
     */
    omit?: workflow_statusOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: workflow_statusInclude<ExtArgs> | null
    where?: workflow_statusWhereInput
  }

  /**
   * task without action
   */
  export type taskDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the task
     */
    select?: taskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the task
     */
    omit?: taskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: taskInclude<ExtArgs> | null
  }


  /**
   * Model workflow_status
   */

  export type AggregateWorkflow_status = {
    _count: Workflow_statusCountAggregateOutputType | null
    _avg: Workflow_statusAvgAggregateOutputType | null
    _sum: Workflow_statusSumAggregateOutputType | null
    _min: Workflow_statusMinAggregateOutputType | null
    _max: Workflow_statusMaxAggregateOutputType | null
  }

  export type Workflow_statusAvgAggregateOutputType = {
    sort_ordr: number | null
  }

  export type Workflow_statusSumAggregateOutputType = {
    sort_ordr: number | null
  }

  export type Workflow_statusMinAggregateOutputType = {
    id: string | null
    project_id: string | null
    name: string | null
    sort_ordr: number | null
    notion_option_id: string | null
  }

  export type Workflow_statusMaxAggregateOutputType = {
    id: string | null
    project_id: string | null
    name: string | null
    sort_ordr: number | null
    notion_option_id: string | null
  }

  export type Workflow_statusCountAggregateOutputType = {
    id: number
    project_id: number
    name: number
    sort_ordr: number
    notion_option_id: number
    _all: number
  }


  export type Workflow_statusAvgAggregateInputType = {
    sort_ordr?: true
  }

  export type Workflow_statusSumAggregateInputType = {
    sort_ordr?: true
  }

  export type Workflow_statusMinAggregateInputType = {
    id?: true
    project_id?: true
    name?: true
    sort_ordr?: true
    notion_option_id?: true
  }

  export type Workflow_statusMaxAggregateInputType = {
    id?: true
    project_id?: true
    name?: true
    sort_ordr?: true
    notion_option_id?: true
  }

  export type Workflow_statusCountAggregateInputType = {
    id?: true
    project_id?: true
    name?: true
    sort_ordr?: true
    notion_option_id?: true
    _all?: true
  }

  export type Workflow_statusAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which workflow_status to aggregate.
     */
    where?: workflow_statusWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of workflow_statuses to fetch.
     */
    orderBy?: workflow_statusOrderByWithRelationInput | workflow_statusOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: workflow_statusWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` workflow_statuses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` workflow_statuses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned workflow_statuses
    **/
    _count?: true | Workflow_statusCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Workflow_statusAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Workflow_statusSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Workflow_statusMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Workflow_statusMaxAggregateInputType
  }

  export type GetWorkflow_statusAggregateType<T extends Workflow_statusAggregateArgs> = {
        [P in keyof T & keyof AggregateWorkflow_status]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWorkflow_status[P]>
      : GetScalarType<T[P], AggregateWorkflow_status[P]>
  }




  export type workflow_statusGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: workflow_statusWhereInput
    orderBy?: workflow_statusOrderByWithAggregationInput | workflow_statusOrderByWithAggregationInput[]
    by: Workflow_statusScalarFieldEnum[] | Workflow_statusScalarFieldEnum
    having?: workflow_statusScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Workflow_statusCountAggregateInputType | true
    _avg?: Workflow_statusAvgAggregateInputType
    _sum?: Workflow_statusSumAggregateInputType
    _min?: Workflow_statusMinAggregateInputType
    _max?: Workflow_statusMaxAggregateInputType
  }

  export type Workflow_statusGroupByOutputType = {
    id: string
    project_id: string
    name: string
    sort_ordr: number | null
    notion_option_id: string | null
    _count: Workflow_statusCountAggregateOutputType | null
    _avg: Workflow_statusAvgAggregateOutputType | null
    _sum: Workflow_statusSumAggregateOutputType | null
    _min: Workflow_statusMinAggregateOutputType | null
    _max: Workflow_statusMaxAggregateOutputType | null
  }

  type GetWorkflow_statusGroupByPayload<T extends workflow_statusGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Workflow_statusGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Workflow_statusGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Workflow_statusGroupByOutputType[P]>
            : GetScalarType<T[P], Workflow_statusGroupByOutputType[P]>
        }
      >
    >


  export type workflow_statusSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    project_id?: boolean
    name?: boolean
    sort_ordr?: boolean
    notion_option_id?: boolean
    task?: boolean | workflow_status$taskArgs<ExtArgs>
    project?: boolean | projectDefaultArgs<ExtArgs>
    _count?: boolean | Workflow_statusCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workflow_status"]>

  export type workflow_statusSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    project_id?: boolean
    name?: boolean
    sort_ordr?: boolean
    notion_option_id?: boolean
    project?: boolean | projectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workflow_status"]>

  export type workflow_statusSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    project_id?: boolean
    name?: boolean
    sort_ordr?: boolean
    notion_option_id?: boolean
    project?: boolean | projectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workflow_status"]>

  export type workflow_statusSelectScalar = {
    id?: boolean
    project_id?: boolean
    name?: boolean
    sort_ordr?: boolean
    notion_option_id?: boolean
  }

  export type workflow_statusOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "project_id" | "name" | "sort_ordr" | "notion_option_id", ExtArgs["result"]["workflow_status"]>
  export type workflow_statusInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    task?: boolean | workflow_status$taskArgs<ExtArgs>
    project?: boolean | projectDefaultArgs<ExtArgs>
    _count?: boolean | Workflow_statusCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type workflow_statusIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | projectDefaultArgs<ExtArgs>
  }
  export type workflow_statusIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | projectDefaultArgs<ExtArgs>
  }

  export type $workflow_statusPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "workflow_status"
    objects: {
      task: Prisma.$taskPayload<ExtArgs>[]
      project: Prisma.$projectPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      project_id: string
      name: string
      sort_ordr: number | null
      notion_option_id: string | null
    }, ExtArgs["result"]["workflow_status"]>
    composites: {}
  }

  type workflow_statusGetPayload<S extends boolean | null | undefined | workflow_statusDefaultArgs> = $Result.GetResult<Prisma.$workflow_statusPayload, S>

  type workflow_statusCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<workflow_statusFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Workflow_statusCountAggregateInputType | true
    }

  export interface workflow_statusDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['workflow_status'], meta: { name: 'workflow_status' } }
    /**
     * Find zero or one Workflow_status that matches the filter.
     * @param {workflow_statusFindUniqueArgs} args - Arguments to find a Workflow_status
     * @example
     * // Get one Workflow_status
     * const workflow_status = await prisma.workflow_status.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends workflow_statusFindUniqueArgs>(args: SelectSubset<T, workflow_statusFindUniqueArgs<ExtArgs>>): Prisma__workflow_statusClient<$Result.GetResult<Prisma.$workflow_statusPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Workflow_status that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {workflow_statusFindUniqueOrThrowArgs} args - Arguments to find a Workflow_status
     * @example
     * // Get one Workflow_status
     * const workflow_status = await prisma.workflow_status.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends workflow_statusFindUniqueOrThrowArgs>(args: SelectSubset<T, workflow_statusFindUniqueOrThrowArgs<ExtArgs>>): Prisma__workflow_statusClient<$Result.GetResult<Prisma.$workflow_statusPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Workflow_status that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {workflow_statusFindFirstArgs} args - Arguments to find a Workflow_status
     * @example
     * // Get one Workflow_status
     * const workflow_status = await prisma.workflow_status.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends workflow_statusFindFirstArgs>(args?: SelectSubset<T, workflow_statusFindFirstArgs<ExtArgs>>): Prisma__workflow_statusClient<$Result.GetResult<Prisma.$workflow_statusPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Workflow_status that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {workflow_statusFindFirstOrThrowArgs} args - Arguments to find a Workflow_status
     * @example
     * // Get one Workflow_status
     * const workflow_status = await prisma.workflow_status.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends workflow_statusFindFirstOrThrowArgs>(args?: SelectSubset<T, workflow_statusFindFirstOrThrowArgs<ExtArgs>>): Prisma__workflow_statusClient<$Result.GetResult<Prisma.$workflow_statusPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Workflow_statuses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {workflow_statusFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Workflow_statuses
     * const workflow_statuses = await prisma.workflow_status.findMany()
     * 
     * // Get first 10 Workflow_statuses
     * const workflow_statuses = await prisma.workflow_status.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const workflow_statusWithIdOnly = await prisma.workflow_status.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends workflow_statusFindManyArgs>(args?: SelectSubset<T, workflow_statusFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$workflow_statusPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Workflow_status.
     * @param {workflow_statusCreateArgs} args - Arguments to create a Workflow_status.
     * @example
     * // Create one Workflow_status
     * const Workflow_status = await prisma.workflow_status.create({
     *   data: {
     *     // ... data to create a Workflow_status
     *   }
     * })
     * 
     */
    create<T extends workflow_statusCreateArgs>(args: SelectSubset<T, workflow_statusCreateArgs<ExtArgs>>): Prisma__workflow_statusClient<$Result.GetResult<Prisma.$workflow_statusPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Workflow_statuses.
     * @param {workflow_statusCreateManyArgs} args - Arguments to create many Workflow_statuses.
     * @example
     * // Create many Workflow_statuses
     * const workflow_status = await prisma.workflow_status.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends workflow_statusCreateManyArgs>(args?: SelectSubset<T, workflow_statusCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Workflow_statuses and returns the data saved in the database.
     * @param {workflow_statusCreateManyAndReturnArgs} args - Arguments to create many Workflow_statuses.
     * @example
     * // Create many Workflow_statuses
     * const workflow_status = await prisma.workflow_status.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Workflow_statuses and only return the `id`
     * const workflow_statusWithIdOnly = await prisma.workflow_status.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends workflow_statusCreateManyAndReturnArgs>(args?: SelectSubset<T, workflow_statusCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$workflow_statusPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Workflow_status.
     * @param {workflow_statusDeleteArgs} args - Arguments to delete one Workflow_status.
     * @example
     * // Delete one Workflow_status
     * const Workflow_status = await prisma.workflow_status.delete({
     *   where: {
     *     // ... filter to delete one Workflow_status
     *   }
     * })
     * 
     */
    delete<T extends workflow_statusDeleteArgs>(args: SelectSubset<T, workflow_statusDeleteArgs<ExtArgs>>): Prisma__workflow_statusClient<$Result.GetResult<Prisma.$workflow_statusPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Workflow_status.
     * @param {workflow_statusUpdateArgs} args - Arguments to update one Workflow_status.
     * @example
     * // Update one Workflow_status
     * const workflow_status = await prisma.workflow_status.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends workflow_statusUpdateArgs>(args: SelectSubset<T, workflow_statusUpdateArgs<ExtArgs>>): Prisma__workflow_statusClient<$Result.GetResult<Prisma.$workflow_statusPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Workflow_statuses.
     * @param {workflow_statusDeleteManyArgs} args - Arguments to filter Workflow_statuses to delete.
     * @example
     * // Delete a few Workflow_statuses
     * const { count } = await prisma.workflow_status.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends workflow_statusDeleteManyArgs>(args?: SelectSubset<T, workflow_statusDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Workflow_statuses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {workflow_statusUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Workflow_statuses
     * const workflow_status = await prisma.workflow_status.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends workflow_statusUpdateManyArgs>(args: SelectSubset<T, workflow_statusUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Workflow_statuses and returns the data updated in the database.
     * @param {workflow_statusUpdateManyAndReturnArgs} args - Arguments to update many Workflow_statuses.
     * @example
     * // Update many Workflow_statuses
     * const workflow_status = await prisma.workflow_status.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Workflow_statuses and only return the `id`
     * const workflow_statusWithIdOnly = await prisma.workflow_status.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends workflow_statusUpdateManyAndReturnArgs>(args: SelectSubset<T, workflow_statusUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$workflow_statusPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Workflow_status.
     * @param {workflow_statusUpsertArgs} args - Arguments to update or create a Workflow_status.
     * @example
     * // Update or create a Workflow_status
     * const workflow_status = await prisma.workflow_status.upsert({
     *   create: {
     *     // ... data to create a Workflow_status
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Workflow_status we want to update
     *   }
     * })
     */
    upsert<T extends workflow_statusUpsertArgs>(args: SelectSubset<T, workflow_statusUpsertArgs<ExtArgs>>): Prisma__workflow_statusClient<$Result.GetResult<Prisma.$workflow_statusPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Workflow_statuses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {workflow_statusCountArgs} args - Arguments to filter Workflow_statuses to count.
     * @example
     * // Count the number of Workflow_statuses
     * const count = await prisma.workflow_status.count({
     *   where: {
     *     // ... the filter for the Workflow_statuses we want to count
     *   }
     * })
    **/
    count<T extends workflow_statusCountArgs>(
      args?: Subset<T, workflow_statusCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Workflow_statusCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Workflow_status.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Workflow_statusAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Workflow_statusAggregateArgs>(args: Subset<T, Workflow_statusAggregateArgs>): Prisma.PrismaPromise<GetWorkflow_statusAggregateType<T>>

    /**
     * Group by Workflow_status.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {workflow_statusGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends workflow_statusGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: workflow_statusGroupByArgs['orderBy'] }
        : { orderBy?: workflow_statusGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, workflow_statusGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWorkflow_statusGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the workflow_status model
   */
  readonly fields: workflow_statusFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for workflow_status.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__workflow_statusClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    task<T extends workflow_status$taskArgs<ExtArgs> = {}>(args?: Subset<T, workflow_status$taskArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$taskPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    project<T extends projectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, projectDefaultArgs<ExtArgs>>): Prisma__projectClient<$Result.GetResult<Prisma.$projectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the workflow_status model
   */
  interface workflow_statusFieldRefs {
    readonly id: FieldRef<"workflow_status", 'String'>
    readonly project_id: FieldRef<"workflow_status", 'String'>
    readonly name: FieldRef<"workflow_status", 'String'>
    readonly sort_ordr: FieldRef<"workflow_status", 'Int'>
    readonly notion_option_id: FieldRef<"workflow_status", 'String'>
  }
    

  // Custom InputTypes
  /**
   * workflow_status findUnique
   */
  export type workflow_statusFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the workflow_status
     */
    select?: workflow_statusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the workflow_status
     */
    omit?: workflow_statusOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: workflow_statusInclude<ExtArgs> | null
    /**
     * Filter, which workflow_status to fetch.
     */
    where: workflow_statusWhereUniqueInput
  }

  /**
   * workflow_status findUniqueOrThrow
   */
  export type workflow_statusFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the workflow_status
     */
    select?: workflow_statusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the workflow_status
     */
    omit?: workflow_statusOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: workflow_statusInclude<ExtArgs> | null
    /**
     * Filter, which workflow_status to fetch.
     */
    where: workflow_statusWhereUniqueInput
  }

  /**
   * workflow_status findFirst
   */
  export type workflow_statusFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the workflow_status
     */
    select?: workflow_statusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the workflow_status
     */
    omit?: workflow_statusOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: workflow_statusInclude<ExtArgs> | null
    /**
     * Filter, which workflow_status to fetch.
     */
    where?: workflow_statusWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of workflow_statuses to fetch.
     */
    orderBy?: workflow_statusOrderByWithRelationInput | workflow_statusOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for workflow_statuses.
     */
    cursor?: workflow_statusWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` workflow_statuses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` workflow_statuses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of workflow_statuses.
     */
    distinct?: Workflow_statusScalarFieldEnum | Workflow_statusScalarFieldEnum[]
  }

  /**
   * workflow_status findFirstOrThrow
   */
  export type workflow_statusFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the workflow_status
     */
    select?: workflow_statusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the workflow_status
     */
    omit?: workflow_statusOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: workflow_statusInclude<ExtArgs> | null
    /**
     * Filter, which workflow_status to fetch.
     */
    where?: workflow_statusWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of workflow_statuses to fetch.
     */
    orderBy?: workflow_statusOrderByWithRelationInput | workflow_statusOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for workflow_statuses.
     */
    cursor?: workflow_statusWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` workflow_statuses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` workflow_statuses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of workflow_statuses.
     */
    distinct?: Workflow_statusScalarFieldEnum | Workflow_statusScalarFieldEnum[]
  }

  /**
   * workflow_status findMany
   */
  export type workflow_statusFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the workflow_status
     */
    select?: workflow_statusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the workflow_status
     */
    omit?: workflow_statusOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: workflow_statusInclude<ExtArgs> | null
    /**
     * Filter, which workflow_statuses to fetch.
     */
    where?: workflow_statusWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of workflow_statuses to fetch.
     */
    orderBy?: workflow_statusOrderByWithRelationInput | workflow_statusOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing workflow_statuses.
     */
    cursor?: workflow_statusWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` workflow_statuses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` workflow_statuses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of workflow_statuses.
     */
    distinct?: Workflow_statusScalarFieldEnum | Workflow_statusScalarFieldEnum[]
  }

  /**
   * workflow_status create
   */
  export type workflow_statusCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the workflow_status
     */
    select?: workflow_statusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the workflow_status
     */
    omit?: workflow_statusOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: workflow_statusInclude<ExtArgs> | null
    /**
     * The data needed to create a workflow_status.
     */
    data: XOR<workflow_statusCreateInput, workflow_statusUncheckedCreateInput>
  }

  /**
   * workflow_status createMany
   */
  export type workflow_statusCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many workflow_statuses.
     */
    data: workflow_statusCreateManyInput | workflow_statusCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * workflow_status createManyAndReturn
   */
  export type workflow_statusCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the workflow_status
     */
    select?: workflow_statusSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the workflow_status
     */
    omit?: workflow_statusOmit<ExtArgs> | null
    /**
     * The data used to create many workflow_statuses.
     */
    data: workflow_statusCreateManyInput | workflow_statusCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: workflow_statusIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * workflow_status update
   */
  export type workflow_statusUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the workflow_status
     */
    select?: workflow_statusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the workflow_status
     */
    omit?: workflow_statusOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: workflow_statusInclude<ExtArgs> | null
    /**
     * The data needed to update a workflow_status.
     */
    data: XOR<workflow_statusUpdateInput, workflow_statusUncheckedUpdateInput>
    /**
     * Choose, which workflow_status to update.
     */
    where: workflow_statusWhereUniqueInput
  }

  /**
   * workflow_status updateMany
   */
  export type workflow_statusUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update workflow_statuses.
     */
    data: XOR<workflow_statusUpdateManyMutationInput, workflow_statusUncheckedUpdateManyInput>
    /**
     * Filter which workflow_statuses to update
     */
    where?: workflow_statusWhereInput
    /**
     * Limit how many workflow_statuses to update.
     */
    limit?: number
  }

  /**
   * workflow_status updateManyAndReturn
   */
  export type workflow_statusUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the workflow_status
     */
    select?: workflow_statusSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the workflow_status
     */
    omit?: workflow_statusOmit<ExtArgs> | null
    /**
     * The data used to update workflow_statuses.
     */
    data: XOR<workflow_statusUpdateManyMutationInput, workflow_statusUncheckedUpdateManyInput>
    /**
     * Filter which workflow_statuses to update
     */
    where?: workflow_statusWhereInput
    /**
     * Limit how many workflow_statuses to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: workflow_statusIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * workflow_status upsert
   */
  export type workflow_statusUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the workflow_status
     */
    select?: workflow_statusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the workflow_status
     */
    omit?: workflow_statusOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: workflow_statusInclude<ExtArgs> | null
    /**
     * The filter to search for the workflow_status to update in case it exists.
     */
    where: workflow_statusWhereUniqueInput
    /**
     * In case the workflow_status found by the `where` argument doesn't exist, create a new workflow_status with this data.
     */
    create: XOR<workflow_statusCreateInput, workflow_statusUncheckedCreateInput>
    /**
     * In case the workflow_status was found with the provided `where` argument, update it with this data.
     */
    update: XOR<workflow_statusUpdateInput, workflow_statusUncheckedUpdateInput>
  }

  /**
   * workflow_status delete
   */
  export type workflow_statusDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the workflow_status
     */
    select?: workflow_statusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the workflow_status
     */
    omit?: workflow_statusOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: workflow_statusInclude<ExtArgs> | null
    /**
     * Filter which workflow_status to delete.
     */
    where: workflow_statusWhereUniqueInput
  }

  /**
   * workflow_status deleteMany
   */
  export type workflow_statusDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which workflow_statuses to delete
     */
    where?: workflow_statusWhereInput
    /**
     * Limit how many workflow_statuses to delete.
     */
    limit?: number
  }

  /**
   * workflow_status.task
   */
  export type workflow_status$taskArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the task
     */
    select?: taskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the task
     */
    omit?: taskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: taskInclude<ExtArgs> | null
    where?: taskWhereInput
    orderBy?: taskOrderByWithRelationInput | taskOrderByWithRelationInput[]
    cursor?: taskWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * workflow_status without action
   */
  export type workflow_statusDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the workflow_status
     */
    select?: workflow_statusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the workflow_status
     */
    omit?: workflow_statusOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: workflow_statusInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ProfilesScalarFieldEnum: {
    id: 'id',
    full_name: 'full_name',
    notion_user_id: 'notion_user_id',
    avatar_url: 'avatar_url'
  };

  export type ProfilesScalarFieldEnum = (typeof ProfilesScalarFieldEnum)[keyof typeof ProfilesScalarFieldEnum]


  export const ProjectScalarFieldEnum: {
    id: 'id',
    title: 'title',
    notion_db_id: 'notion_db_id',
    description: 'description',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type ProjectScalarFieldEnum = (typeof ProjectScalarFieldEnum)[keyof typeof ProjectScalarFieldEnum]


  export const Sync_logScalarFieldEnum: {
    id: 'id',
    task_id: 'task_id',
    direction: 'direction',
    sync_status: 'sync_status',
    error_message: 'error_message',
    retry_count: 'retry_count',
    synced_at: 'synced_at'
  };

  export type Sync_logScalarFieldEnum = (typeof Sync_logScalarFieldEnum)[keyof typeof Sync_logScalarFieldEnum]


  export const TaskScalarFieldEnum: {
    id: 'id',
    project_id: 'project_id',
    status_id: 'status_id',
    notion_page_id: 'notion_page_id',
    title: 'title',
    deleted_at: 'deleted_at',
    content: 'content',
    start_date: 'start_date',
    end_date: 'end_date',
    priority: 'priority',
    assignees: 'assignees',
    tags: 'tags',
    raw_notion_data: 'raw_notion_data',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type TaskScalarFieldEnum = (typeof TaskScalarFieldEnum)[keyof typeof TaskScalarFieldEnum]


  export const Workflow_statusScalarFieldEnum: {
    id: 'id',
    project_id: 'project_id',
    name: 'name',
    sort_ordr: 'sort_ordr',
    notion_option_id: 'notion_option_id'
  };

  export type Workflow_statusScalarFieldEnum = (typeof Workflow_statusScalarFieldEnum)[keyof typeof Workflow_statusScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type profilesWhereInput = {
    AND?: profilesWhereInput | profilesWhereInput[]
    OR?: profilesWhereInput[]
    NOT?: profilesWhereInput | profilesWhereInput[]
    id?: UuidFilter<"profiles"> | string
    full_name?: StringNullableFilter<"profiles"> | string | null
    notion_user_id?: StringNullableFilter<"profiles"> | string | null
    avatar_url?: StringNullableFilter<"profiles"> | string | null
  }

  export type profilesOrderByWithRelationInput = {
    id?: SortOrder
    full_name?: SortOrderInput | SortOrder
    notion_user_id?: SortOrderInput | SortOrder
    avatar_url?: SortOrderInput | SortOrder
  }

  export type profilesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: profilesWhereInput | profilesWhereInput[]
    OR?: profilesWhereInput[]
    NOT?: profilesWhereInput | profilesWhereInput[]
    full_name?: StringNullableFilter<"profiles"> | string | null
    notion_user_id?: StringNullableFilter<"profiles"> | string | null
    avatar_url?: StringNullableFilter<"profiles"> | string | null
  }, "id">

  export type profilesOrderByWithAggregationInput = {
    id?: SortOrder
    full_name?: SortOrderInput | SortOrder
    notion_user_id?: SortOrderInput | SortOrder
    avatar_url?: SortOrderInput | SortOrder
    _count?: profilesCountOrderByAggregateInput
    _max?: profilesMaxOrderByAggregateInput
    _min?: profilesMinOrderByAggregateInput
  }

  export type profilesScalarWhereWithAggregatesInput = {
    AND?: profilesScalarWhereWithAggregatesInput | profilesScalarWhereWithAggregatesInput[]
    OR?: profilesScalarWhereWithAggregatesInput[]
    NOT?: profilesScalarWhereWithAggregatesInput | profilesScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"profiles"> | string
    full_name?: StringNullableWithAggregatesFilter<"profiles"> | string | null
    notion_user_id?: StringNullableWithAggregatesFilter<"profiles"> | string | null
    avatar_url?: StringNullableWithAggregatesFilter<"profiles"> | string | null
  }

  export type projectWhereInput = {
    AND?: projectWhereInput | projectWhereInput[]
    OR?: projectWhereInput[]
    NOT?: projectWhereInput | projectWhereInput[]
    id?: UuidFilter<"project"> | string
    title?: StringFilter<"project"> | string
    notion_db_id?: StringFilter<"project"> | string
    description?: StringNullableFilter<"project"> | string | null
    created_at?: DateTimeNullableFilter<"project"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"project"> | Date | string | null
    task?: TaskListRelationFilter
    workflow_status?: Workflow_statusListRelationFilter
  }

  export type projectOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    notion_db_id?: SortOrder
    description?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    task?: taskOrderByRelationAggregateInput
    workflow_status?: workflow_statusOrderByRelationAggregateInput
  }

  export type projectWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    notion_db_id?: string
    AND?: projectWhereInput | projectWhereInput[]
    OR?: projectWhereInput[]
    NOT?: projectWhereInput | projectWhereInput[]
    title?: StringFilter<"project"> | string
    description?: StringNullableFilter<"project"> | string | null
    created_at?: DateTimeNullableFilter<"project"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"project"> | Date | string | null
    task?: TaskListRelationFilter
    workflow_status?: Workflow_statusListRelationFilter
  }, "id" | "notion_db_id">

  export type projectOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    notion_db_id?: SortOrder
    description?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    _count?: projectCountOrderByAggregateInput
    _max?: projectMaxOrderByAggregateInput
    _min?: projectMinOrderByAggregateInput
  }

  export type projectScalarWhereWithAggregatesInput = {
    AND?: projectScalarWhereWithAggregatesInput | projectScalarWhereWithAggregatesInput[]
    OR?: projectScalarWhereWithAggregatesInput[]
    NOT?: projectScalarWhereWithAggregatesInput | projectScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"project"> | string
    title?: StringWithAggregatesFilter<"project"> | string
    notion_db_id?: StringWithAggregatesFilter<"project"> | string
    description?: StringNullableWithAggregatesFilter<"project"> | string | null
    created_at?: DateTimeNullableWithAggregatesFilter<"project"> | Date | string | null
    updated_at?: DateTimeNullableWithAggregatesFilter<"project"> | Date | string | null
  }

  export type sync_logWhereInput = {
    AND?: sync_logWhereInput | sync_logWhereInput[]
    OR?: sync_logWhereInput[]
    NOT?: sync_logWhereInput | sync_logWhereInput[]
    id?: BigIntFilter<"sync_log"> | bigint | number
    task_id?: UuidFilter<"sync_log"> | string
    direction?: StringNullableFilter<"sync_log"> | string | null
    sync_status?: StringNullableFilter<"sync_log"> | string | null
    error_message?: StringNullableFilter<"sync_log"> | string | null
    retry_count?: IntNullableFilter<"sync_log"> | number | null
    synced_at?: DateTimeFilter<"sync_log"> | Date | string
    task?: XOR<TaskScalarRelationFilter, taskWhereInput>
  }

  export type sync_logOrderByWithRelationInput = {
    id?: SortOrder
    task_id?: SortOrder
    direction?: SortOrderInput | SortOrder
    sync_status?: SortOrderInput | SortOrder
    error_message?: SortOrderInput | SortOrder
    retry_count?: SortOrderInput | SortOrder
    synced_at?: SortOrder
    task?: taskOrderByWithRelationInput
  }

  export type sync_logWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: sync_logWhereInput | sync_logWhereInput[]
    OR?: sync_logWhereInput[]
    NOT?: sync_logWhereInput | sync_logWhereInput[]
    task_id?: UuidFilter<"sync_log"> | string
    direction?: StringNullableFilter<"sync_log"> | string | null
    sync_status?: StringNullableFilter<"sync_log"> | string | null
    error_message?: StringNullableFilter<"sync_log"> | string | null
    retry_count?: IntNullableFilter<"sync_log"> | number | null
    synced_at?: DateTimeFilter<"sync_log"> | Date | string
    task?: XOR<TaskScalarRelationFilter, taskWhereInput>
  }, "id">

  export type sync_logOrderByWithAggregationInput = {
    id?: SortOrder
    task_id?: SortOrder
    direction?: SortOrderInput | SortOrder
    sync_status?: SortOrderInput | SortOrder
    error_message?: SortOrderInput | SortOrder
    retry_count?: SortOrderInput | SortOrder
    synced_at?: SortOrder
    _count?: sync_logCountOrderByAggregateInput
    _avg?: sync_logAvgOrderByAggregateInput
    _max?: sync_logMaxOrderByAggregateInput
    _min?: sync_logMinOrderByAggregateInput
    _sum?: sync_logSumOrderByAggregateInput
  }

  export type sync_logScalarWhereWithAggregatesInput = {
    AND?: sync_logScalarWhereWithAggregatesInput | sync_logScalarWhereWithAggregatesInput[]
    OR?: sync_logScalarWhereWithAggregatesInput[]
    NOT?: sync_logScalarWhereWithAggregatesInput | sync_logScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"sync_log"> | bigint | number
    task_id?: UuidWithAggregatesFilter<"sync_log"> | string
    direction?: StringNullableWithAggregatesFilter<"sync_log"> | string | null
    sync_status?: StringNullableWithAggregatesFilter<"sync_log"> | string | null
    error_message?: StringNullableWithAggregatesFilter<"sync_log"> | string | null
    retry_count?: IntNullableWithAggregatesFilter<"sync_log"> | number | null
    synced_at?: DateTimeWithAggregatesFilter<"sync_log"> | Date | string
  }

  export type taskWhereInput = {
    AND?: taskWhereInput | taskWhereInput[]
    OR?: taskWhereInput[]
    NOT?: taskWhereInput | taskWhereInput[]
    id?: UuidFilter<"task"> | string
    project_id?: UuidNullableFilter<"task"> | string | null
    status_id?: UuidNullableFilter<"task"> | string | null
    notion_page_id?: StringNullableFilter<"task"> | string | null
    title?: StringFilter<"task"> | string
    deleted_at?: DateTimeNullableFilter<"task"> | Date | string | null
    content?: StringNullableFilter<"task"> | string | null
    start_date?: DateTimeNullableFilter<"task"> | Date | string | null
    end_date?: DateTimeNullableFilter<"task"> | Date | string | null
    priority?: StringNullableFilter<"task"> | string | null
    assignees?: JsonNullableFilter<"task">
    tags?: StringNullableFilter<"task"> | string | null
    raw_notion_data?: JsonNullableFilter<"task">
    created_at?: DateTimeNullableFilter<"task"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"task"> | Date | string | null
    sync_log?: Sync_logListRelationFilter
    project?: XOR<ProjectNullableScalarRelationFilter, projectWhereInput> | null
    workflow_status?: XOR<Workflow_statusNullableScalarRelationFilter, workflow_statusWhereInput> | null
  }

  export type taskOrderByWithRelationInput = {
    id?: SortOrder
    project_id?: SortOrderInput | SortOrder
    status_id?: SortOrderInput | SortOrder
    notion_page_id?: SortOrderInput | SortOrder
    title?: SortOrder
    deleted_at?: SortOrderInput | SortOrder
    content?: SortOrderInput | SortOrder
    start_date?: SortOrderInput | SortOrder
    end_date?: SortOrderInput | SortOrder
    priority?: SortOrderInput | SortOrder
    assignees?: SortOrderInput | SortOrder
    tags?: SortOrderInput | SortOrder
    raw_notion_data?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    sync_log?: sync_logOrderByRelationAggregateInput
    project?: projectOrderByWithRelationInput
    workflow_status?: workflow_statusOrderByWithRelationInput
  }

  export type taskWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    notion_page_id?: string
    AND?: taskWhereInput | taskWhereInput[]
    OR?: taskWhereInput[]
    NOT?: taskWhereInput | taskWhereInput[]
    project_id?: UuidNullableFilter<"task"> | string | null
    status_id?: UuidNullableFilter<"task"> | string | null
    title?: StringFilter<"task"> | string
    deleted_at?: DateTimeNullableFilter<"task"> | Date | string | null
    content?: StringNullableFilter<"task"> | string | null
    start_date?: DateTimeNullableFilter<"task"> | Date | string | null
    end_date?: DateTimeNullableFilter<"task"> | Date | string | null
    priority?: StringNullableFilter<"task"> | string | null
    assignees?: JsonNullableFilter<"task">
    tags?: StringNullableFilter<"task"> | string | null
    raw_notion_data?: JsonNullableFilter<"task">
    created_at?: DateTimeNullableFilter<"task"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"task"> | Date | string | null
    sync_log?: Sync_logListRelationFilter
    project?: XOR<ProjectNullableScalarRelationFilter, projectWhereInput> | null
    workflow_status?: XOR<Workflow_statusNullableScalarRelationFilter, workflow_statusWhereInput> | null
  }, "id" | "notion_page_id">

  export type taskOrderByWithAggregationInput = {
    id?: SortOrder
    project_id?: SortOrderInput | SortOrder
    status_id?: SortOrderInput | SortOrder
    notion_page_id?: SortOrderInput | SortOrder
    title?: SortOrder
    deleted_at?: SortOrderInput | SortOrder
    content?: SortOrderInput | SortOrder
    start_date?: SortOrderInput | SortOrder
    end_date?: SortOrderInput | SortOrder
    priority?: SortOrderInput | SortOrder
    assignees?: SortOrderInput | SortOrder
    tags?: SortOrderInput | SortOrder
    raw_notion_data?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    _count?: taskCountOrderByAggregateInput
    _max?: taskMaxOrderByAggregateInput
    _min?: taskMinOrderByAggregateInput
  }

  export type taskScalarWhereWithAggregatesInput = {
    AND?: taskScalarWhereWithAggregatesInput | taskScalarWhereWithAggregatesInput[]
    OR?: taskScalarWhereWithAggregatesInput[]
    NOT?: taskScalarWhereWithAggregatesInput | taskScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"task"> | string
    project_id?: UuidNullableWithAggregatesFilter<"task"> | string | null
    status_id?: UuidNullableWithAggregatesFilter<"task"> | string | null
    notion_page_id?: StringNullableWithAggregatesFilter<"task"> | string | null
    title?: StringWithAggregatesFilter<"task"> | string
    deleted_at?: DateTimeNullableWithAggregatesFilter<"task"> | Date | string | null
    content?: StringNullableWithAggregatesFilter<"task"> | string | null
    start_date?: DateTimeNullableWithAggregatesFilter<"task"> | Date | string | null
    end_date?: DateTimeNullableWithAggregatesFilter<"task"> | Date | string | null
    priority?: StringNullableWithAggregatesFilter<"task"> | string | null
    assignees?: JsonNullableWithAggregatesFilter<"task">
    tags?: StringNullableWithAggregatesFilter<"task"> | string | null
    raw_notion_data?: JsonNullableWithAggregatesFilter<"task">
    created_at?: DateTimeNullableWithAggregatesFilter<"task"> | Date | string | null
    updated_at?: DateTimeNullableWithAggregatesFilter<"task"> | Date | string | null
  }

  export type workflow_statusWhereInput = {
    AND?: workflow_statusWhereInput | workflow_statusWhereInput[]
    OR?: workflow_statusWhereInput[]
    NOT?: workflow_statusWhereInput | workflow_statusWhereInput[]
    id?: UuidFilter<"workflow_status"> | string
    project_id?: UuidFilter<"workflow_status"> | string
    name?: StringFilter<"workflow_status"> | string
    sort_ordr?: IntNullableFilter<"workflow_status"> | number | null
    notion_option_id?: StringNullableFilter<"workflow_status"> | string | null
    task?: TaskListRelationFilter
    project?: XOR<ProjectScalarRelationFilter, projectWhereInput>
  }

  export type workflow_statusOrderByWithRelationInput = {
    id?: SortOrder
    project_id?: SortOrder
    name?: SortOrder
    sort_ordr?: SortOrderInput | SortOrder
    notion_option_id?: SortOrderInput | SortOrder
    task?: taskOrderByRelationAggregateInput
    project?: projectOrderByWithRelationInput
  }

  export type workflow_statusWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: workflow_statusWhereInput | workflow_statusWhereInput[]
    OR?: workflow_statusWhereInput[]
    NOT?: workflow_statusWhereInput | workflow_statusWhereInput[]
    project_id?: UuidFilter<"workflow_status"> | string
    name?: StringFilter<"workflow_status"> | string
    sort_ordr?: IntNullableFilter<"workflow_status"> | number | null
    notion_option_id?: StringNullableFilter<"workflow_status"> | string | null
    task?: TaskListRelationFilter
    project?: XOR<ProjectScalarRelationFilter, projectWhereInput>
  }, "id">

  export type workflow_statusOrderByWithAggregationInput = {
    id?: SortOrder
    project_id?: SortOrder
    name?: SortOrder
    sort_ordr?: SortOrderInput | SortOrder
    notion_option_id?: SortOrderInput | SortOrder
    _count?: workflow_statusCountOrderByAggregateInput
    _avg?: workflow_statusAvgOrderByAggregateInput
    _max?: workflow_statusMaxOrderByAggregateInput
    _min?: workflow_statusMinOrderByAggregateInput
    _sum?: workflow_statusSumOrderByAggregateInput
  }

  export type workflow_statusScalarWhereWithAggregatesInput = {
    AND?: workflow_statusScalarWhereWithAggregatesInput | workflow_statusScalarWhereWithAggregatesInput[]
    OR?: workflow_statusScalarWhereWithAggregatesInput[]
    NOT?: workflow_statusScalarWhereWithAggregatesInput | workflow_statusScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"workflow_status"> | string
    project_id?: UuidWithAggregatesFilter<"workflow_status"> | string
    name?: StringWithAggregatesFilter<"workflow_status"> | string
    sort_ordr?: IntNullableWithAggregatesFilter<"workflow_status"> | number | null
    notion_option_id?: StringNullableWithAggregatesFilter<"workflow_status"> | string | null
  }

  export type profilesCreateInput = {
    id?: string
    full_name?: string | null
    notion_user_id?: string | null
    avatar_url?: string | null
  }

  export type profilesUncheckedCreateInput = {
    id?: string
    full_name?: string | null
    notion_user_id?: string | null
    avatar_url?: string | null
  }

  export type profilesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    notion_user_id?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type profilesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    notion_user_id?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type profilesCreateManyInput = {
    id?: string
    full_name?: string | null
    notion_user_id?: string | null
    avatar_url?: string | null
  }

  export type profilesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    notion_user_id?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type profilesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    notion_user_id?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type projectCreateInput = {
    id?: string
    title: string
    notion_db_id: string
    description?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    task?: taskCreateNestedManyWithoutProjectInput
    workflow_status?: workflow_statusCreateNestedManyWithoutProjectInput
  }

  export type projectUncheckedCreateInput = {
    id?: string
    title: string
    notion_db_id: string
    description?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    task?: taskUncheckedCreateNestedManyWithoutProjectInput
    workflow_status?: workflow_statusUncheckedCreateNestedManyWithoutProjectInput
  }

  export type projectUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    notion_db_id?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    task?: taskUpdateManyWithoutProjectNestedInput
    workflow_status?: workflow_statusUpdateManyWithoutProjectNestedInput
  }

  export type projectUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    notion_db_id?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    task?: taskUncheckedUpdateManyWithoutProjectNestedInput
    workflow_status?: workflow_statusUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type projectCreateManyInput = {
    id?: string
    title: string
    notion_db_id: string
    description?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type projectUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    notion_db_id?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type projectUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    notion_db_id?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type sync_logCreateInput = {
    id?: bigint | number
    direction?: string | null
    sync_status?: string | null
    error_message?: string | null
    retry_count?: number | null
    synced_at: Date | string
    task?: taskCreateNestedOneWithoutSync_logInput
  }

  export type sync_logUncheckedCreateInput = {
    id?: bigint | number
    task_id?: string
    direction?: string | null
    sync_status?: string | null
    error_message?: string | null
    retry_count?: number | null
    synced_at: Date | string
  }

  export type sync_logUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    direction?: NullableStringFieldUpdateOperationsInput | string | null
    sync_status?: NullableStringFieldUpdateOperationsInput | string | null
    error_message?: NullableStringFieldUpdateOperationsInput | string | null
    retry_count?: NullableIntFieldUpdateOperationsInput | number | null
    synced_at?: DateTimeFieldUpdateOperationsInput | Date | string
    task?: taskUpdateOneRequiredWithoutSync_logNestedInput
  }

  export type sync_logUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    task_id?: StringFieldUpdateOperationsInput | string
    direction?: NullableStringFieldUpdateOperationsInput | string | null
    sync_status?: NullableStringFieldUpdateOperationsInput | string | null
    error_message?: NullableStringFieldUpdateOperationsInput | string | null
    retry_count?: NullableIntFieldUpdateOperationsInput | number | null
    synced_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type sync_logCreateManyInput = {
    id?: bigint | number
    task_id?: string
    direction?: string | null
    sync_status?: string | null
    error_message?: string | null
    retry_count?: number | null
    synced_at: Date | string
  }

  export type sync_logUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    direction?: NullableStringFieldUpdateOperationsInput | string | null
    sync_status?: NullableStringFieldUpdateOperationsInput | string | null
    error_message?: NullableStringFieldUpdateOperationsInput | string | null
    retry_count?: NullableIntFieldUpdateOperationsInput | number | null
    synced_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type sync_logUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    task_id?: StringFieldUpdateOperationsInput | string
    direction?: NullableStringFieldUpdateOperationsInput | string | null
    sync_status?: NullableStringFieldUpdateOperationsInput | string | null
    error_message?: NullableStringFieldUpdateOperationsInput | string | null
    retry_count?: NullableIntFieldUpdateOperationsInput | number | null
    synced_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type taskCreateInput = {
    id?: string
    notion_page_id?: string | null
    title: string
    deleted_at?: Date | string | null
    content?: string | null
    start_date?: Date | string | null
    end_date?: Date | string | null
    priority?: string | null
    assignees?: NullableJsonNullValueInput | InputJsonValue
    tags?: string | null
    raw_notion_data?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
    sync_log?: sync_logCreateNestedManyWithoutTaskInput
    project?: projectCreateNestedOneWithoutTaskInput
    workflow_status?: workflow_statusCreateNestedOneWithoutTaskInput
  }

  export type taskUncheckedCreateInput = {
    id?: string
    project_id?: string | null
    status_id?: string | null
    notion_page_id?: string | null
    title: string
    deleted_at?: Date | string | null
    content?: string | null
    start_date?: Date | string | null
    end_date?: Date | string | null
    priority?: string | null
    assignees?: NullableJsonNullValueInput | InputJsonValue
    tags?: string | null
    raw_notion_data?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
    sync_log?: sync_logUncheckedCreateNestedManyWithoutTaskInput
  }

  export type taskUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    notion_page_id?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    assignees?: NullableJsonNullValueInput | InputJsonValue
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    raw_notion_data?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sync_log?: sync_logUpdateManyWithoutTaskNestedInput
    project?: projectUpdateOneWithoutTaskNestedInput
    workflow_status?: workflow_statusUpdateOneWithoutTaskNestedInput
  }

  export type taskUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    project_id?: NullableStringFieldUpdateOperationsInput | string | null
    status_id?: NullableStringFieldUpdateOperationsInput | string | null
    notion_page_id?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    assignees?: NullableJsonNullValueInput | InputJsonValue
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    raw_notion_data?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sync_log?: sync_logUncheckedUpdateManyWithoutTaskNestedInput
  }

  export type taskCreateManyInput = {
    id?: string
    project_id?: string | null
    status_id?: string | null
    notion_page_id?: string | null
    title: string
    deleted_at?: Date | string | null
    content?: string | null
    start_date?: Date | string | null
    end_date?: Date | string | null
    priority?: string | null
    assignees?: NullableJsonNullValueInput | InputJsonValue
    tags?: string | null
    raw_notion_data?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type taskUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    notion_page_id?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    assignees?: NullableJsonNullValueInput | InputJsonValue
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    raw_notion_data?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type taskUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    project_id?: NullableStringFieldUpdateOperationsInput | string | null
    status_id?: NullableStringFieldUpdateOperationsInput | string | null
    notion_page_id?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    assignees?: NullableJsonNullValueInput | InputJsonValue
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    raw_notion_data?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type workflow_statusCreateInput = {
    id?: string
    name: string
    sort_ordr?: number | null
    notion_option_id?: string | null
    task?: taskCreateNestedManyWithoutWorkflow_statusInput
    project: projectCreateNestedOneWithoutWorkflow_statusInput
  }

  export type workflow_statusUncheckedCreateInput = {
    id?: string
    project_id: string
    name: string
    sort_ordr?: number | null
    notion_option_id?: string | null
    task?: taskUncheckedCreateNestedManyWithoutWorkflow_statusInput
  }

  export type workflow_statusUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sort_ordr?: NullableIntFieldUpdateOperationsInput | number | null
    notion_option_id?: NullableStringFieldUpdateOperationsInput | string | null
    task?: taskUpdateManyWithoutWorkflow_statusNestedInput
    project?: projectUpdateOneRequiredWithoutWorkflow_statusNestedInput
  }

  export type workflow_statusUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    project_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sort_ordr?: NullableIntFieldUpdateOperationsInput | number | null
    notion_option_id?: NullableStringFieldUpdateOperationsInput | string | null
    task?: taskUncheckedUpdateManyWithoutWorkflow_statusNestedInput
  }

  export type workflow_statusCreateManyInput = {
    id?: string
    project_id: string
    name: string
    sort_ordr?: number | null
    notion_option_id?: string | null
  }

  export type workflow_statusUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sort_ordr?: NullableIntFieldUpdateOperationsInput | number | null
    notion_option_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type workflow_statusUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    project_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sort_ordr?: NullableIntFieldUpdateOperationsInput | number | null
    notion_option_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type profilesCountOrderByAggregateInput = {
    id?: SortOrder
    full_name?: SortOrder
    notion_user_id?: SortOrder
    avatar_url?: SortOrder
  }

  export type profilesMaxOrderByAggregateInput = {
    id?: SortOrder
    full_name?: SortOrder
    notion_user_id?: SortOrder
    avatar_url?: SortOrder
  }

  export type profilesMinOrderByAggregateInput = {
    id?: SortOrder
    full_name?: SortOrder
    notion_user_id?: SortOrder
    avatar_url?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type TaskListRelationFilter = {
    every?: taskWhereInput
    some?: taskWhereInput
    none?: taskWhereInput
  }

  export type Workflow_statusListRelationFilter = {
    every?: workflow_statusWhereInput
    some?: workflow_statusWhereInput
    none?: workflow_statusWhereInput
  }

  export type taskOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type workflow_statusOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type projectCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    notion_db_id?: SortOrder
    description?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type projectMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    notion_db_id?: SortOrder
    description?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type projectMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    notion_db_id?: SortOrder
    description?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type TaskScalarRelationFilter = {
    is?: taskWhereInput
    isNot?: taskWhereInput
  }

  export type sync_logCountOrderByAggregateInput = {
    id?: SortOrder
    task_id?: SortOrder
    direction?: SortOrder
    sync_status?: SortOrder
    error_message?: SortOrder
    retry_count?: SortOrder
    synced_at?: SortOrder
  }

  export type sync_logAvgOrderByAggregateInput = {
    id?: SortOrder
    retry_count?: SortOrder
  }

  export type sync_logMaxOrderByAggregateInput = {
    id?: SortOrder
    task_id?: SortOrder
    direction?: SortOrder
    sync_status?: SortOrder
    error_message?: SortOrder
    retry_count?: SortOrder
    synced_at?: SortOrder
  }

  export type sync_logMinOrderByAggregateInput = {
    id?: SortOrder
    task_id?: SortOrder
    direction?: SortOrder
    sync_status?: SortOrder
    error_message?: SortOrder
    retry_count?: SortOrder
    synced_at?: SortOrder
  }

  export type sync_logSumOrderByAggregateInput = {
    id?: SortOrder
    retry_count?: SortOrder
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type Sync_logListRelationFilter = {
    every?: sync_logWhereInput
    some?: sync_logWhereInput
    none?: sync_logWhereInput
  }

  export type ProjectNullableScalarRelationFilter = {
    is?: projectWhereInput | null
    isNot?: projectWhereInput | null
  }

  export type Workflow_statusNullableScalarRelationFilter = {
    is?: workflow_statusWhereInput | null
    isNot?: workflow_statusWhereInput | null
  }

  export type sync_logOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type taskCountOrderByAggregateInput = {
    id?: SortOrder
    project_id?: SortOrder
    status_id?: SortOrder
    notion_page_id?: SortOrder
    title?: SortOrder
    deleted_at?: SortOrder
    content?: SortOrder
    start_date?: SortOrder
    end_date?: SortOrder
    priority?: SortOrder
    assignees?: SortOrder
    tags?: SortOrder
    raw_notion_data?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type taskMaxOrderByAggregateInput = {
    id?: SortOrder
    project_id?: SortOrder
    status_id?: SortOrder
    notion_page_id?: SortOrder
    title?: SortOrder
    deleted_at?: SortOrder
    content?: SortOrder
    start_date?: SortOrder
    end_date?: SortOrder
    priority?: SortOrder
    tags?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type taskMinOrderByAggregateInput = {
    id?: SortOrder
    project_id?: SortOrder
    status_id?: SortOrder
    notion_page_id?: SortOrder
    title?: SortOrder
    deleted_at?: SortOrder
    content?: SortOrder
    start_date?: SortOrder
    end_date?: SortOrder
    priority?: SortOrder
    tags?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type UuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type ProjectScalarRelationFilter = {
    is?: projectWhereInput
    isNot?: projectWhereInput
  }

  export type workflow_statusCountOrderByAggregateInput = {
    id?: SortOrder
    project_id?: SortOrder
    name?: SortOrder
    sort_ordr?: SortOrder
    notion_option_id?: SortOrder
  }

  export type workflow_statusAvgOrderByAggregateInput = {
    sort_ordr?: SortOrder
  }

  export type workflow_statusMaxOrderByAggregateInput = {
    id?: SortOrder
    project_id?: SortOrder
    name?: SortOrder
    sort_ordr?: SortOrder
    notion_option_id?: SortOrder
  }

  export type workflow_statusMinOrderByAggregateInput = {
    id?: SortOrder
    project_id?: SortOrder
    name?: SortOrder
    sort_ordr?: SortOrder
    notion_option_id?: SortOrder
  }

  export type workflow_statusSumOrderByAggregateInput = {
    sort_ordr?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type taskCreateNestedManyWithoutProjectInput = {
    create?: XOR<taskCreateWithoutProjectInput, taskUncheckedCreateWithoutProjectInput> | taskCreateWithoutProjectInput[] | taskUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: taskCreateOrConnectWithoutProjectInput | taskCreateOrConnectWithoutProjectInput[]
    createMany?: taskCreateManyProjectInputEnvelope
    connect?: taskWhereUniqueInput | taskWhereUniqueInput[]
  }

  export type workflow_statusCreateNestedManyWithoutProjectInput = {
    create?: XOR<workflow_statusCreateWithoutProjectInput, workflow_statusUncheckedCreateWithoutProjectInput> | workflow_statusCreateWithoutProjectInput[] | workflow_statusUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: workflow_statusCreateOrConnectWithoutProjectInput | workflow_statusCreateOrConnectWithoutProjectInput[]
    createMany?: workflow_statusCreateManyProjectInputEnvelope
    connect?: workflow_statusWhereUniqueInput | workflow_statusWhereUniqueInput[]
  }

  export type taskUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<taskCreateWithoutProjectInput, taskUncheckedCreateWithoutProjectInput> | taskCreateWithoutProjectInput[] | taskUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: taskCreateOrConnectWithoutProjectInput | taskCreateOrConnectWithoutProjectInput[]
    createMany?: taskCreateManyProjectInputEnvelope
    connect?: taskWhereUniqueInput | taskWhereUniqueInput[]
  }

  export type workflow_statusUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<workflow_statusCreateWithoutProjectInput, workflow_statusUncheckedCreateWithoutProjectInput> | workflow_statusCreateWithoutProjectInput[] | workflow_statusUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: workflow_statusCreateOrConnectWithoutProjectInput | workflow_statusCreateOrConnectWithoutProjectInput[]
    createMany?: workflow_statusCreateManyProjectInputEnvelope
    connect?: workflow_statusWhereUniqueInput | workflow_statusWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type taskUpdateManyWithoutProjectNestedInput = {
    create?: XOR<taskCreateWithoutProjectInput, taskUncheckedCreateWithoutProjectInput> | taskCreateWithoutProjectInput[] | taskUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: taskCreateOrConnectWithoutProjectInput | taskCreateOrConnectWithoutProjectInput[]
    upsert?: taskUpsertWithWhereUniqueWithoutProjectInput | taskUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: taskCreateManyProjectInputEnvelope
    set?: taskWhereUniqueInput | taskWhereUniqueInput[]
    disconnect?: taskWhereUniqueInput | taskWhereUniqueInput[]
    delete?: taskWhereUniqueInput | taskWhereUniqueInput[]
    connect?: taskWhereUniqueInput | taskWhereUniqueInput[]
    update?: taskUpdateWithWhereUniqueWithoutProjectInput | taskUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: taskUpdateManyWithWhereWithoutProjectInput | taskUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: taskScalarWhereInput | taskScalarWhereInput[]
  }

  export type workflow_statusUpdateManyWithoutProjectNestedInput = {
    create?: XOR<workflow_statusCreateWithoutProjectInput, workflow_statusUncheckedCreateWithoutProjectInput> | workflow_statusCreateWithoutProjectInput[] | workflow_statusUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: workflow_statusCreateOrConnectWithoutProjectInput | workflow_statusCreateOrConnectWithoutProjectInput[]
    upsert?: workflow_statusUpsertWithWhereUniqueWithoutProjectInput | workflow_statusUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: workflow_statusCreateManyProjectInputEnvelope
    set?: workflow_statusWhereUniqueInput | workflow_statusWhereUniqueInput[]
    disconnect?: workflow_statusWhereUniqueInput | workflow_statusWhereUniqueInput[]
    delete?: workflow_statusWhereUniqueInput | workflow_statusWhereUniqueInput[]
    connect?: workflow_statusWhereUniqueInput | workflow_statusWhereUniqueInput[]
    update?: workflow_statusUpdateWithWhereUniqueWithoutProjectInput | workflow_statusUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: workflow_statusUpdateManyWithWhereWithoutProjectInput | workflow_statusUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: workflow_statusScalarWhereInput | workflow_statusScalarWhereInput[]
  }

  export type taskUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<taskCreateWithoutProjectInput, taskUncheckedCreateWithoutProjectInput> | taskCreateWithoutProjectInput[] | taskUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: taskCreateOrConnectWithoutProjectInput | taskCreateOrConnectWithoutProjectInput[]
    upsert?: taskUpsertWithWhereUniqueWithoutProjectInput | taskUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: taskCreateManyProjectInputEnvelope
    set?: taskWhereUniqueInput | taskWhereUniqueInput[]
    disconnect?: taskWhereUniqueInput | taskWhereUniqueInput[]
    delete?: taskWhereUniqueInput | taskWhereUniqueInput[]
    connect?: taskWhereUniqueInput | taskWhereUniqueInput[]
    update?: taskUpdateWithWhereUniqueWithoutProjectInput | taskUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: taskUpdateManyWithWhereWithoutProjectInput | taskUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: taskScalarWhereInput | taskScalarWhereInput[]
  }

  export type workflow_statusUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<workflow_statusCreateWithoutProjectInput, workflow_statusUncheckedCreateWithoutProjectInput> | workflow_statusCreateWithoutProjectInput[] | workflow_statusUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: workflow_statusCreateOrConnectWithoutProjectInput | workflow_statusCreateOrConnectWithoutProjectInput[]
    upsert?: workflow_statusUpsertWithWhereUniqueWithoutProjectInput | workflow_statusUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: workflow_statusCreateManyProjectInputEnvelope
    set?: workflow_statusWhereUniqueInput | workflow_statusWhereUniqueInput[]
    disconnect?: workflow_statusWhereUniqueInput | workflow_statusWhereUniqueInput[]
    delete?: workflow_statusWhereUniqueInput | workflow_statusWhereUniqueInput[]
    connect?: workflow_statusWhereUniqueInput | workflow_statusWhereUniqueInput[]
    update?: workflow_statusUpdateWithWhereUniqueWithoutProjectInput | workflow_statusUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: workflow_statusUpdateManyWithWhereWithoutProjectInput | workflow_statusUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: workflow_statusScalarWhereInput | workflow_statusScalarWhereInput[]
  }

  export type taskCreateNestedOneWithoutSync_logInput = {
    create?: XOR<taskCreateWithoutSync_logInput, taskUncheckedCreateWithoutSync_logInput>
    connectOrCreate?: taskCreateOrConnectWithoutSync_logInput
    connect?: taskWhereUniqueInput
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type taskUpdateOneRequiredWithoutSync_logNestedInput = {
    create?: XOR<taskCreateWithoutSync_logInput, taskUncheckedCreateWithoutSync_logInput>
    connectOrCreate?: taskCreateOrConnectWithoutSync_logInput
    upsert?: taskUpsertWithoutSync_logInput
    connect?: taskWhereUniqueInput
    update?: XOR<XOR<taskUpdateToOneWithWhereWithoutSync_logInput, taskUpdateWithoutSync_logInput>, taskUncheckedUpdateWithoutSync_logInput>
  }

  export type sync_logCreateNestedManyWithoutTaskInput = {
    create?: XOR<sync_logCreateWithoutTaskInput, sync_logUncheckedCreateWithoutTaskInput> | sync_logCreateWithoutTaskInput[] | sync_logUncheckedCreateWithoutTaskInput[]
    connectOrCreate?: sync_logCreateOrConnectWithoutTaskInput | sync_logCreateOrConnectWithoutTaskInput[]
    createMany?: sync_logCreateManyTaskInputEnvelope
    connect?: sync_logWhereUniqueInput | sync_logWhereUniqueInput[]
  }

  export type projectCreateNestedOneWithoutTaskInput = {
    create?: XOR<projectCreateWithoutTaskInput, projectUncheckedCreateWithoutTaskInput>
    connectOrCreate?: projectCreateOrConnectWithoutTaskInput
    connect?: projectWhereUniqueInput
  }

  export type workflow_statusCreateNestedOneWithoutTaskInput = {
    create?: XOR<workflow_statusCreateWithoutTaskInput, workflow_statusUncheckedCreateWithoutTaskInput>
    connectOrCreate?: workflow_statusCreateOrConnectWithoutTaskInput
    connect?: workflow_statusWhereUniqueInput
  }

  export type sync_logUncheckedCreateNestedManyWithoutTaskInput = {
    create?: XOR<sync_logCreateWithoutTaskInput, sync_logUncheckedCreateWithoutTaskInput> | sync_logCreateWithoutTaskInput[] | sync_logUncheckedCreateWithoutTaskInput[]
    connectOrCreate?: sync_logCreateOrConnectWithoutTaskInput | sync_logCreateOrConnectWithoutTaskInput[]
    createMany?: sync_logCreateManyTaskInputEnvelope
    connect?: sync_logWhereUniqueInput | sync_logWhereUniqueInput[]
  }

  export type sync_logUpdateManyWithoutTaskNestedInput = {
    create?: XOR<sync_logCreateWithoutTaskInput, sync_logUncheckedCreateWithoutTaskInput> | sync_logCreateWithoutTaskInput[] | sync_logUncheckedCreateWithoutTaskInput[]
    connectOrCreate?: sync_logCreateOrConnectWithoutTaskInput | sync_logCreateOrConnectWithoutTaskInput[]
    upsert?: sync_logUpsertWithWhereUniqueWithoutTaskInput | sync_logUpsertWithWhereUniqueWithoutTaskInput[]
    createMany?: sync_logCreateManyTaskInputEnvelope
    set?: sync_logWhereUniqueInput | sync_logWhereUniqueInput[]
    disconnect?: sync_logWhereUniqueInput | sync_logWhereUniqueInput[]
    delete?: sync_logWhereUniqueInput | sync_logWhereUniqueInput[]
    connect?: sync_logWhereUniqueInput | sync_logWhereUniqueInput[]
    update?: sync_logUpdateWithWhereUniqueWithoutTaskInput | sync_logUpdateWithWhereUniqueWithoutTaskInput[]
    updateMany?: sync_logUpdateManyWithWhereWithoutTaskInput | sync_logUpdateManyWithWhereWithoutTaskInput[]
    deleteMany?: sync_logScalarWhereInput | sync_logScalarWhereInput[]
  }

  export type projectUpdateOneWithoutTaskNestedInput = {
    create?: XOR<projectCreateWithoutTaskInput, projectUncheckedCreateWithoutTaskInput>
    connectOrCreate?: projectCreateOrConnectWithoutTaskInput
    upsert?: projectUpsertWithoutTaskInput
    disconnect?: projectWhereInput | boolean
    delete?: projectWhereInput | boolean
    connect?: projectWhereUniqueInput
    update?: XOR<XOR<projectUpdateToOneWithWhereWithoutTaskInput, projectUpdateWithoutTaskInput>, projectUncheckedUpdateWithoutTaskInput>
  }

  export type workflow_statusUpdateOneWithoutTaskNestedInput = {
    create?: XOR<workflow_statusCreateWithoutTaskInput, workflow_statusUncheckedCreateWithoutTaskInput>
    connectOrCreate?: workflow_statusCreateOrConnectWithoutTaskInput
    upsert?: workflow_statusUpsertWithoutTaskInput
    disconnect?: workflow_statusWhereInput | boolean
    delete?: workflow_statusWhereInput | boolean
    connect?: workflow_statusWhereUniqueInput
    update?: XOR<XOR<workflow_statusUpdateToOneWithWhereWithoutTaskInput, workflow_statusUpdateWithoutTaskInput>, workflow_statusUncheckedUpdateWithoutTaskInput>
  }

  export type sync_logUncheckedUpdateManyWithoutTaskNestedInput = {
    create?: XOR<sync_logCreateWithoutTaskInput, sync_logUncheckedCreateWithoutTaskInput> | sync_logCreateWithoutTaskInput[] | sync_logUncheckedCreateWithoutTaskInput[]
    connectOrCreate?: sync_logCreateOrConnectWithoutTaskInput | sync_logCreateOrConnectWithoutTaskInput[]
    upsert?: sync_logUpsertWithWhereUniqueWithoutTaskInput | sync_logUpsertWithWhereUniqueWithoutTaskInput[]
    createMany?: sync_logCreateManyTaskInputEnvelope
    set?: sync_logWhereUniqueInput | sync_logWhereUniqueInput[]
    disconnect?: sync_logWhereUniqueInput | sync_logWhereUniqueInput[]
    delete?: sync_logWhereUniqueInput | sync_logWhereUniqueInput[]
    connect?: sync_logWhereUniqueInput | sync_logWhereUniqueInput[]
    update?: sync_logUpdateWithWhereUniqueWithoutTaskInput | sync_logUpdateWithWhereUniqueWithoutTaskInput[]
    updateMany?: sync_logUpdateManyWithWhereWithoutTaskInput | sync_logUpdateManyWithWhereWithoutTaskInput[]
    deleteMany?: sync_logScalarWhereInput | sync_logScalarWhereInput[]
  }

  export type taskCreateNestedManyWithoutWorkflow_statusInput = {
    create?: XOR<taskCreateWithoutWorkflow_statusInput, taskUncheckedCreateWithoutWorkflow_statusInput> | taskCreateWithoutWorkflow_statusInput[] | taskUncheckedCreateWithoutWorkflow_statusInput[]
    connectOrCreate?: taskCreateOrConnectWithoutWorkflow_statusInput | taskCreateOrConnectWithoutWorkflow_statusInput[]
    createMany?: taskCreateManyWorkflow_statusInputEnvelope
    connect?: taskWhereUniqueInput | taskWhereUniqueInput[]
  }

  export type projectCreateNestedOneWithoutWorkflow_statusInput = {
    create?: XOR<projectCreateWithoutWorkflow_statusInput, projectUncheckedCreateWithoutWorkflow_statusInput>
    connectOrCreate?: projectCreateOrConnectWithoutWorkflow_statusInput
    connect?: projectWhereUniqueInput
  }

  export type taskUncheckedCreateNestedManyWithoutWorkflow_statusInput = {
    create?: XOR<taskCreateWithoutWorkflow_statusInput, taskUncheckedCreateWithoutWorkflow_statusInput> | taskCreateWithoutWorkflow_statusInput[] | taskUncheckedCreateWithoutWorkflow_statusInput[]
    connectOrCreate?: taskCreateOrConnectWithoutWorkflow_statusInput | taskCreateOrConnectWithoutWorkflow_statusInput[]
    createMany?: taskCreateManyWorkflow_statusInputEnvelope
    connect?: taskWhereUniqueInput | taskWhereUniqueInput[]
  }

  export type taskUpdateManyWithoutWorkflow_statusNestedInput = {
    create?: XOR<taskCreateWithoutWorkflow_statusInput, taskUncheckedCreateWithoutWorkflow_statusInput> | taskCreateWithoutWorkflow_statusInput[] | taskUncheckedCreateWithoutWorkflow_statusInput[]
    connectOrCreate?: taskCreateOrConnectWithoutWorkflow_statusInput | taskCreateOrConnectWithoutWorkflow_statusInput[]
    upsert?: taskUpsertWithWhereUniqueWithoutWorkflow_statusInput | taskUpsertWithWhereUniqueWithoutWorkflow_statusInput[]
    createMany?: taskCreateManyWorkflow_statusInputEnvelope
    set?: taskWhereUniqueInput | taskWhereUniqueInput[]
    disconnect?: taskWhereUniqueInput | taskWhereUniqueInput[]
    delete?: taskWhereUniqueInput | taskWhereUniqueInput[]
    connect?: taskWhereUniqueInput | taskWhereUniqueInput[]
    update?: taskUpdateWithWhereUniqueWithoutWorkflow_statusInput | taskUpdateWithWhereUniqueWithoutWorkflow_statusInput[]
    updateMany?: taskUpdateManyWithWhereWithoutWorkflow_statusInput | taskUpdateManyWithWhereWithoutWorkflow_statusInput[]
    deleteMany?: taskScalarWhereInput | taskScalarWhereInput[]
  }

  export type projectUpdateOneRequiredWithoutWorkflow_statusNestedInput = {
    create?: XOR<projectCreateWithoutWorkflow_statusInput, projectUncheckedCreateWithoutWorkflow_statusInput>
    connectOrCreate?: projectCreateOrConnectWithoutWorkflow_statusInput
    upsert?: projectUpsertWithoutWorkflow_statusInput
    connect?: projectWhereUniqueInput
    update?: XOR<XOR<projectUpdateToOneWithWhereWithoutWorkflow_statusInput, projectUpdateWithoutWorkflow_statusInput>, projectUncheckedUpdateWithoutWorkflow_statusInput>
  }

  export type taskUncheckedUpdateManyWithoutWorkflow_statusNestedInput = {
    create?: XOR<taskCreateWithoutWorkflow_statusInput, taskUncheckedCreateWithoutWorkflow_statusInput> | taskCreateWithoutWorkflow_statusInput[] | taskUncheckedCreateWithoutWorkflow_statusInput[]
    connectOrCreate?: taskCreateOrConnectWithoutWorkflow_statusInput | taskCreateOrConnectWithoutWorkflow_statusInput[]
    upsert?: taskUpsertWithWhereUniqueWithoutWorkflow_statusInput | taskUpsertWithWhereUniqueWithoutWorkflow_statusInput[]
    createMany?: taskCreateManyWorkflow_statusInputEnvelope
    set?: taskWhereUniqueInput | taskWhereUniqueInput[]
    disconnect?: taskWhereUniqueInput | taskWhereUniqueInput[]
    delete?: taskWhereUniqueInput | taskWhereUniqueInput[]
    connect?: taskWhereUniqueInput | taskWhereUniqueInput[]
    update?: taskUpdateWithWhereUniqueWithoutWorkflow_statusInput | taskUpdateWithWhereUniqueWithoutWorkflow_statusInput[]
    updateMany?: taskUpdateManyWithWhereWithoutWorkflow_statusInput | taskUpdateManyWithWhereWithoutWorkflow_statusInput[]
    deleteMany?: taskScalarWhereInput | taskScalarWhereInput[]
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedUuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type NestedUuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type taskCreateWithoutProjectInput = {
    id?: string
    notion_page_id?: string | null
    title: string
    deleted_at?: Date | string | null
    content?: string | null
    start_date?: Date | string | null
    end_date?: Date | string | null
    priority?: string | null
    assignees?: NullableJsonNullValueInput | InputJsonValue
    tags?: string | null
    raw_notion_data?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
    sync_log?: sync_logCreateNestedManyWithoutTaskInput
    workflow_status?: workflow_statusCreateNestedOneWithoutTaskInput
  }

  export type taskUncheckedCreateWithoutProjectInput = {
    id?: string
    status_id?: string | null
    notion_page_id?: string | null
    title: string
    deleted_at?: Date | string | null
    content?: string | null
    start_date?: Date | string | null
    end_date?: Date | string | null
    priority?: string | null
    assignees?: NullableJsonNullValueInput | InputJsonValue
    tags?: string | null
    raw_notion_data?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
    sync_log?: sync_logUncheckedCreateNestedManyWithoutTaskInput
  }

  export type taskCreateOrConnectWithoutProjectInput = {
    where: taskWhereUniqueInput
    create: XOR<taskCreateWithoutProjectInput, taskUncheckedCreateWithoutProjectInput>
  }

  export type taskCreateManyProjectInputEnvelope = {
    data: taskCreateManyProjectInput | taskCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type workflow_statusCreateWithoutProjectInput = {
    id?: string
    name: string
    sort_ordr?: number | null
    notion_option_id?: string | null
    task?: taskCreateNestedManyWithoutWorkflow_statusInput
  }

  export type workflow_statusUncheckedCreateWithoutProjectInput = {
    id?: string
    name: string
    sort_ordr?: number | null
    notion_option_id?: string | null
    task?: taskUncheckedCreateNestedManyWithoutWorkflow_statusInput
  }

  export type workflow_statusCreateOrConnectWithoutProjectInput = {
    where: workflow_statusWhereUniqueInput
    create: XOR<workflow_statusCreateWithoutProjectInput, workflow_statusUncheckedCreateWithoutProjectInput>
  }

  export type workflow_statusCreateManyProjectInputEnvelope = {
    data: workflow_statusCreateManyProjectInput | workflow_statusCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type taskUpsertWithWhereUniqueWithoutProjectInput = {
    where: taskWhereUniqueInput
    update: XOR<taskUpdateWithoutProjectInput, taskUncheckedUpdateWithoutProjectInput>
    create: XOR<taskCreateWithoutProjectInput, taskUncheckedCreateWithoutProjectInput>
  }

  export type taskUpdateWithWhereUniqueWithoutProjectInput = {
    where: taskWhereUniqueInput
    data: XOR<taskUpdateWithoutProjectInput, taskUncheckedUpdateWithoutProjectInput>
  }

  export type taskUpdateManyWithWhereWithoutProjectInput = {
    where: taskScalarWhereInput
    data: XOR<taskUpdateManyMutationInput, taskUncheckedUpdateManyWithoutProjectInput>
  }

  export type taskScalarWhereInput = {
    AND?: taskScalarWhereInput | taskScalarWhereInput[]
    OR?: taskScalarWhereInput[]
    NOT?: taskScalarWhereInput | taskScalarWhereInput[]
    id?: UuidFilter<"task"> | string
    project_id?: UuidNullableFilter<"task"> | string | null
    status_id?: UuidNullableFilter<"task"> | string | null
    notion_page_id?: StringNullableFilter<"task"> | string | null
    title?: StringFilter<"task"> | string
    deleted_at?: DateTimeNullableFilter<"task"> | Date | string | null
    content?: StringNullableFilter<"task"> | string | null
    start_date?: DateTimeNullableFilter<"task"> | Date | string | null
    end_date?: DateTimeNullableFilter<"task"> | Date | string | null
    priority?: StringNullableFilter<"task"> | string | null
    assignees?: JsonNullableFilter<"task">
    tags?: StringNullableFilter<"task"> | string | null
    raw_notion_data?: JsonNullableFilter<"task">
    created_at?: DateTimeNullableFilter<"task"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"task"> | Date | string | null
  }

  export type workflow_statusUpsertWithWhereUniqueWithoutProjectInput = {
    where: workflow_statusWhereUniqueInput
    update: XOR<workflow_statusUpdateWithoutProjectInput, workflow_statusUncheckedUpdateWithoutProjectInput>
    create: XOR<workflow_statusCreateWithoutProjectInput, workflow_statusUncheckedCreateWithoutProjectInput>
  }

  export type workflow_statusUpdateWithWhereUniqueWithoutProjectInput = {
    where: workflow_statusWhereUniqueInput
    data: XOR<workflow_statusUpdateWithoutProjectInput, workflow_statusUncheckedUpdateWithoutProjectInput>
  }

  export type workflow_statusUpdateManyWithWhereWithoutProjectInput = {
    where: workflow_statusScalarWhereInput
    data: XOR<workflow_statusUpdateManyMutationInput, workflow_statusUncheckedUpdateManyWithoutProjectInput>
  }

  export type workflow_statusScalarWhereInput = {
    AND?: workflow_statusScalarWhereInput | workflow_statusScalarWhereInput[]
    OR?: workflow_statusScalarWhereInput[]
    NOT?: workflow_statusScalarWhereInput | workflow_statusScalarWhereInput[]
    id?: UuidFilter<"workflow_status"> | string
    project_id?: UuidFilter<"workflow_status"> | string
    name?: StringFilter<"workflow_status"> | string
    sort_ordr?: IntNullableFilter<"workflow_status"> | number | null
    notion_option_id?: StringNullableFilter<"workflow_status"> | string | null
  }

  export type taskCreateWithoutSync_logInput = {
    id?: string
    notion_page_id?: string | null
    title: string
    deleted_at?: Date | string | null
    content?: string | null
    start_date?: Date | string | null
    end_date?: Date | string | null
    priority?: string | null
    assignees?: NullableJsonNullValueInput | InputJsonValue
    tags?: string | null
    raw_notion_data?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
    project?: projectCreateNestedOneWithoutTaskInput
    workflow_status?: workflow_statusCreateNestedOneWithoutTaskInput
  }

  export type taskUncheckedCreateWithoutSync_logInput = {
    id?: string
    project_id?: string | null
    status_id?: string | null
    notion_page_id?: string | null
    title: string
    deleted_at?: Date | string | null
    content?: string | null
    start_date?: Date | string | null
    end_date?: Date | string | null
    priority?: string | null
    assignees?: NullableJsonNullValueInput | InputJsonValue
    tags?: string | null
    raw_notion_data?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type taskCreateOrConnectWithoutSync_logInput = {
    where: taskWhereUniqueInput
    create: XOR<taskCreateWithoutSync_logInput, taskUncheckedCreateWithoutSync_logInput>
  }

  export type taskUpsertWithoutSync_logInput = {
    update: XOR<taskUpdateWithoutSync_logInput, taskUncheckedUpdateWithoutSync_logInput>
    create: XOR<taskCreateWithoutSync_logInput, taskUncheckedCreateWithoutSync_logInput>
    where?: taskWhereInput
  }

  export type taskUpdateToOneWithWhereWithoutSync_logInput = {
    where?: taskWhereInput
    data: XOR<taskUpdateWithoutSync_logInput, taskUncheckedUpdateWithoutSync_logInput>
  }

  export type taskUpdateWithoutSync_logInput = {
    id?: StringFieldUpdateOperationsInput | string
    notion_page_id?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    assignees?: NullableJsonNullValueInput | InputJsonValue
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    raw_notion_data?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    project?: projectUpdateOneWithoutTaskNestedInput
    workflow_status?: workflow_statusUpdateOneWithoutTaskNestedInput
  }

  export type taskUncheckedUpdateWithoutSync_logInput = {
    id?: StringFieldUpdateOperationsInput | string
    project_id?: NullableStringFieldUpdateOperationsInput | string | null
    status_id?: NullableStringFieldUpdateOperationsInput | string | null
    notion_page_id?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    assignees?: NullableJsonNullValueInput | InputJsonValue
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    raw_notion_data?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type sync_logCreateWithoutTaskInput = {
    id?: bigint | number
    direction?: string | null
    sync_status?: string | null
    error_message?: string | null
    retry_count?: number | null
    synced_at: Date | string
  }

  export type sync_logUncheckedCreateWithoutTaskInput = {
    id?: bigint | number
    direction?: string | null
    sync_status?: string | null
    error_message?: string | null
    retry_count?: number | null
    synced_at: Date | string
  }

  export type sync_logCreateOrConnectWithoutTaskInput = {
    where: sync_logWhereUniqueInput
    create: XOR<sync_logCreateWithoutTaskInput, sync_logUncheckedCreateWithoutTaskInput>
  }

  export type sync_logCreateManyTaskInputEnvelope = {
    data: sync_logCreateManyTaskInput | sync_logCreateManyTaskInput[]
    skipDuplicates?: boolean
  }

  export type projectCreateWithoutTaskInput = {
    id?: string
    title: string
    notion_db_id: string
    description?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    workflow_status?: workflow_statusCreateNestedManyWithoutProjectInput
  }

  export type projectUncheckedCreateWithoutTaskInput = {
    id?: string
    title: string
    notion_db_id: string
    description?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    workflow_status?: workflow_statusUncheckedCreateNestedManyWithoutProjectInput
  }

  export type projectCreateOrConnectWithoutTaskInput = {
    where: projectWhereUniqueInput
    create: XOR<projectCreateWithoutTaskInput, projectUncheckedCreateWithoutTaskInput>
  }

  export type workflow_statusCreateWithoutTaskInput = {
    id?: string
    name: string
    sort_ordr?: number | null
    notion_option_id?: string | null
    project: projectCreateNestedOneWithoutWorkflow_statusInput
  }

  export type workflow_statusUncheckedCreateWithoutTaskInput = {
    id?: string
    project_id: string
    name: string
    sort_ordr?: number | null
    notion_option_id?: string | null
  }

  export type workflow_statusCreateOrConnectWithoutTaskInput = {
    where: workflow_statusWhereUniqueInput
    create: XOR<workflow_statusCreateWithoutTaskInput, workflow_statusUncheckedCreateWithoutTaskInput>
  }

  export type sync_logUpsertWithWhereUniqueWithoutTaskInput = {
    where: sync_logWhereUniqueInput
    update: XOR<sync_logUpdateWithoutTaskInput, sync_logUncheckedUpdateWithoutTaskInput>
    create: XOR<sync_logCreateWithoutTaskInput, sync_logUncheckedCreateWithoutTaskInput>
  }

  export type sync_logUpdateWithWhereUniqueWithoutTaskInput = {
    where: sync_logWhereUniqueInput
    data: XOR<sync_logUpdateWithoutTaskInput, sync_logUncheckedUpdateWithoutTaskInput>
  }

  export type sync_logUpdateManyWithWhereWithoutTaskInput = {
    where: sync_logScalarWhereInput
    data: XOR<sync_logUpdateManyMutationInput, sync_logUncheckedUpdateManyWithoutTaskInput>
  }

  export type sync_logScalarWhereInput = {
    AND?: sync_logScalarWhereInput | sync_logScalarWhereInput[]
    OR?: sync_logScalarWhereInput[]
    NOT?: sync_logScalarWhereInput | sync_logScalarWhereInput[]
    id?: BigIntFilter<"sync_log"> | bigint | number
    task_id?: UuidFilter<"sync_log"> | string
    direction?: StringNullableFilter<"sync_log"> | string | null
    sync_status?: StringNullableFilter<"sync_log"> | string | null
    error_message?: StringNullableFilter<"sync_log"> | string | null
    retry_count?: IntNullableFilter<"sync_log"> | number | null
    synced_at?: DateTimeFilter<"sync_log"> | Date | string
  }

  export type projectUpsertWithoutTaskInput = {
    update: XOR<projectUpdateWithoutTaskInput, projectUncheckedUpdateWithoutTaskInput>
    create: XOR<projectCreateWithoutTaskInput, projectUncheckedCreateWithoutTaskInput>
    where?: projectWhereInput
  }

  export type projectUpdateToOneWithWhereWithoutTaskInput = {
    where?: projectWhereInput
    data: XOR<projectUpdateWithoutTaskInput, projectUncheckedUpdateWithoutTaskInput>
  }

  export type projectUpdateWithoutTaskInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    notion_db_id?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    workflow_status?: workflow_statusUpdateManyWithoutProjectNestedInput
  }

  export type projectUncheckedUpdateWithoutTaskInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    notion_db_id?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    workflow_status?: workflow_statusUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type workflow_statusUpsertWithoutTaskInput = {
    update: XOR<workflow_statusUpdateWithoutTaskInput, workflow_statusUncheckedUpdateWithoutTaskInput>
    create: XOR<workflow_statusCreateWithoutTaskInput, workflow_statusUncheckedCreateWithoutTaskInput>
    where?: workflow_statusWhereInput
  }

  export type workflow_statusUpdateToOneWithWhereWithoutTaskInput = {
    where?: workflow_statusWhereInput
    data: XOR<workflow_statusUpdateWithoutTaskInput, workflow_statusUncheckedUpdateWithoutTaskInput>
  }

  export type workflow_statusUpdateWithoutTaskInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sort_ordr?: NullableIntFieldUpdateOperationsInput | number | null
    notion_option_id?: NullableStringFieldUpdateOperationsInput | string | null
    project?: projectUpdateOneRequiredWithoutWorkflow_statusNestedInput
  }

  export type workflow_statusUncheckedUpdateWithoutTaskInput = {
    id?: StringFieldUpdateOperationsInput | string
    project_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sort_ordr?: NullableIntFieldUpdateOperationsInput | number | null
    notion_option_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type taskCreateWithoutWorkflow_statusInput = {
    id?: string
    notion_page_id?: string | null
    title: string
    deleted_at?: Date | string | null
    content?: string | null
    start_date?: Date | string | null
    end_date?: Date | string | null
    priority?: string | null
    assignees?: NullableJsonNullValueInput | InputJsonValue
    tags?: string | null
    raw_notion_data?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
    sync_log?: sync_logCreateNestedManyWithoutTaskInput
    project?: projectCreateNestedOneWithoutTaskInput
  }

  export type taskUncheckedCreateWithoutWorkflow_statusInput = {
    id?: string
    project_id?: string | null
    notion_page_id?: string | null
    title: string
    deleted_at?: Date | string | null
    content?: string | null
    start_date?: Date | string | null
    end_date?: Date | string | null
    priority?: string | null
    assignees?: NullableJsonNullValueInput | InputJsonValue
    tags?: string | null
    raw_notion_data?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
    sync_log?: sync_logUncheckedCreateNestedManyWithoutTaskInput
  }

  export type taskCreateOrConnectWithoutWorkflow_statusInput = {
    where: taskWhereUniqueInput
    create: XOR<taskCreateWithoutWorkflow_statusInput, taskUncheckedCreateWithoutWorkflow_statusInput>
  }

  export type taskCreateManyWorkflow_statusInputEnvelope = {
    data: taskCreateManyWorkflow_statusInput | taskCreateManyWorkflow_statusInput[]
    skipDuplicates?: boolean
  }

  export type projectCreateWithoutWorkflow_statusInput = {
    id?: string
    title: string
    notion_db_id: string
    description?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    task?: taskCreateNestedManyWithoutProjectInput
  }

  export type projectUncheckedCreateWithoutWorkflow_statusInput = {
    id?: string
    title: string
    notion_db_id: string
    description?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    task?: taskUncheckedCreateNestedManyWithoutProjectInput
  }

  export type projectCreateOrConnectWithoutWorkflow_statusInput = {
    where: projectWhereUniqueInput
    create: XOR<projectCreateWithoutWorkflow_statusInput, projectUncheckedCreateWithoutWorkflow_statusInput>
  }

  export type taskUpsertWithWhereUniqueWithoutWorkflow_statusInput = {
    where: taskWhereUniqueInput
    update: XOR<taskUpdateWithoutWorkflow_statusInput, taskUncheckedUpdateWithoutWorkflow_statusInput>
    create: XOR<taskCreateWithoutWorkflow_statusInput, taskUncheckedCreateWithoutWorkflow_statusInput>
  }

  export type taskUpdateWithWhereUniqueWithoutWorkflow_statusInput = {
    where: taskWhereUniqueInput
    data: XOR<taskUpdateWithoutWorkflow_statusInput, taskUncheckedUpdateWithoutWorkflow_statusInput>
  }

  export type taskUpdateManyWithWhereWithoutWorkflow_statusInput = {
    where: taskScalarWhereInput
    data: XOR<taskUpdateManyMutationInput, taskUncheckedUpdateManyWithoutWorkflow_statusInput>
  }

  export type projectUpsertWithoutWorkflow_statusInput = {
    update: XOR<projectUpdateWithoutWorkflow_statusInput, projectUncheckedUpdateWithoutWorkflow_statusInput>
    create: XOR<projectCreateWithoutWorkflow_statusInput, projectUncheckedCreateWithoutWorkflow_statusInput>
    where?: projectWhereInput
  }

  export type projectUpdateToOneWithWhereWithoutWorkflow_statusInput = {
    where?: projectWhereInput
    data: XOR<projectUpdateWithoutWorkflow_statusInput, projectUncheckedUpdateWithoutWorkflow_statusInput>
  }

  export type projectUpdateWithoutWorkflow_statusInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    notion_db_id?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    task?: taskUpdateManyWithoutProjectNestedInput
  }

  export type projectUncheckedUpdateWithoutWorkflow_statusInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    notion_db_id?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    task?: taskUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type taskCreateManyProjectInput = {
    id?: string
    status_id?: string | null
    notion_page_id?: string | null
    title: string
    deleted_at?: Date | string | null
    content?: string | null
    start_date?: Date | string | null
    end_date?: Date | string | null
    priority?: string | null
    assignees?: NullableJsonNullValueInput | InputJsonValue
    tags?: string | null
    raw_notion_data?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type workflow_statusCreateManyProjectInput = {
    id?: string
    name: string
    sort_ordr?: number | null
    notion_option_id?: string | null
  }

  export type taskUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    notion_page_id?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    assignees?: NullableJsonNullValueInput | InputJsonValue
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    raw_notion_data?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sync_log?: sync_logUpdateManyWithoutTaskNestedInput
    workflow_status?: workflow_statusUpdateOneWithoutTaskNestedInput
  }

  export type taskUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    status_id?: NullableStringFieldUpdateOperationsInput | string | null
    notion_page_id?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    assignees?: NullableJsonNullValueInput | InputJsonValue
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    raw_notion_data?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sync_log?: sync_logUncheckedUpdateManyWithoutTaskNestedInput
  }

  export type taskUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    status_id?: NullableStringFieldUpdateOperationsInput | string | null
    notion_page_id?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    assignees?: NullableJsonNullValueInput | InputJsonValue
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    raw_notion_data?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type workflow_statusUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sort_ordr?: NullableIntFieldUpdateOperationsInput | number | null
    notion_option_id?: NullableStringFieldUpdateOperationsInput | string | null
    task?: taskUpdateManyWithoutWorkflow_statusNestedInput
  }

  export type workflow_statusUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sort_ordr?: NullableIntFieldUpdateOperationsInput | number | null
    notion_option_id?: NullableStringFieldUpdateOperationsInput | string | null
    task?: taskUncheckedUpdateManyWithoutWorkflow_statusNestedInput
  }

  export type workflow_statusUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sort_ordr?: NullableIntFieldUpdateOperationsInput | number | null
    notion_option_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type sync_logCreateManyTaskInput = {
    id?: bigint | number
    direction?: string | null
    sync_status?: string | null
    error_message?: string | null
    retry_count?: number | null
    synced_at: Date | string
  }

  export type sync_logUpdateWithoutTaskInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    direction?: NullableStringFieldUpdateOperationsInput | string | null
    sync_status?: NullableStringFieldUpdateOperationsInput | string | null
    error_message?: NullableStringFieldUpdateOperationsInput | string | null
    retry_count?: NullableIntFieldUpdateOperationsInput | number | null
    synced_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type sync_logUncheckedUpdateWithoutTaskInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    direction?: NullableStringFieldUpdateOperationsInput | string | null
    sync_status?: NullableStringFieldUpdateOperationsInput | string | null
    error_message?: NullableStringFieldUpdateOperationsInput | string | null
    retry_count?: NullableIntFieldUpdateOperationsInput | number | null
    synced_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type sync_logUncheckedUpdateManyWithoutTaskInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    direction?: NullableStringFieldUpdateOperationsInput | string | null
    sync_status?: NullableStringFieldUpdateOperationsInput | string | null
    error_message?: NullableStringFieldUpdateOperationsInput | string | null
    retry_count?: NullableIntFieldUpdateOperationsInput | number | null
    synced_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type taskCreateManyWorkflow_statusInput = {
    id?: string
    project_id?: string | null
    notion_page_id?: string | null
    title: string
    deleted_at?: Date | string | null
    content?: string | null
    start_date?: Date | string | null
    end_date?: Date | string | null
    priority?: string | null
    assignees?: NullableJsonNullValueInput | InputJsonValue
    tags?: string | null
    raw_notion_data?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type taskUpdateWithoutWorkflow_statusInput = {
    id?: StringFieldUpdateOperationsInput | string
    notion_page_id?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    assignees?: NullableJsonNullValueInput | InputJsonValue
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    raw_notion_data?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sync_log?: sync_logUpdateManyWithoutTaskNestedInput
    project?: projectUpdateOneWithoutTaskNestedInput
  }

  export type taskUncheckedUpdateWithoutWorkflow_statusInput = {
    id?: StringFieldUpdateOperationsInput | string
    project_id?: NullableStringFieldUpdateOperationsInput | string | null
    notion_page_id?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    assignees?: NullableJsonNullValueInput | InputJsonValue
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    raw_notion_data?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sync_log?: sync_logUncheckedUpdateManyWithoutTaskNestedInput
  }

  export type taskUncheckedUpdateManyWithoutWorkflow_statusInput = {
    id?: StringFieldUpdateOperationsInput | string
    project_id?: NullableStringFieldUpdateOperationsInput | string | null
    notion_page_id?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    assignees?: NullableJsonNullValueInput | InputJsonValue
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    raw_notion_data?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}