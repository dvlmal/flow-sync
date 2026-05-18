import {
  isRateLimitError,
  isRetryableError,
  calculateBackoffDelay,
  RetryConfig,
} from './sync.types';

describe('Sync Types - Utility Functions', () => {
  describe('isRateLimitError', () => {
    it('should return true for rate_limited code', () => {
      expect(isRateLimitError({ code: 'rate_limited' })).toBe(true);
    });

    it('should return true for 429 status', () => {
      expect(isRateLimitError({ status: 429 })).toBe(true);
    });

    it('should return true for rate limit message', () => {
      expect(isRateLimitError({ message: 'Rate limit exceeded' })).toBe(true);
    });

    it('should return false for other errors', () => {
      expect(isRateLimitError({ code: 'not_found' })).toBe(false);
      expect(isRateLimitError({ status: 404 })).toBe(false);
      expect(isRateLimitError({ message: 'Not found' })).toBe(false);
    });

    it('should return false for null/undefined', () => {
      expect(isRateLimitError(null)).toBe(false);
      expect(isRateLimitError(undefined)).toBe(false);
    });
  });

  describe('isRetryableError', () => {
    it('should return true for rate limit errors', () => {
      expect(isRetryableError({ code: 'rate_limited' })).toBe(true);
    });

    it('should return true for 5xx server errors', () => {
      expect(isRetryableError({ status: 500 })).toBe(true);
      expect(isRetryableError({ status: 502 })).toBe(true);
      expect(isRetryableError({ status: 503 })).toBe(true);
    });

    it('should return true for network errors', () => {
      expect(isRetryableError({ code: 'ECONNRESET' })).toBe(true);
      expect(isRetryableError({ code: 'ETIMEDOUT' })).toBe(true);
    });

    it('should return true for Notion service unavailable', () => {
      expect(isRetryableError({ code: 'service_unavailable' })).toBe(true);
      expect(isRetryableError({ code: 'internal_server_error' })).toBe(true);
    });

    it('should return false for client errors', () => {
      expect(isRetryableError({ status: 400 })).toBe(false);
      expect(isRetryableError({ status: 404 })).toBe(false);
      expect(isRetryableError({ code: 'validation_error' })).toBe(false);
    });
  });

  describe('calculateBackoffDelay', () => {
    const defaultConfig: RetryConfig = {
      maxRetries: 5,
      baseDelayMs: 1000,
      maxDelayMs: 30000,
      exponentialBase: 2,
      jitterFactor: 0.2,
    };

    it('should calculate exponential delay', () => {
      // Without jitter, delays would be: 1000, 2000, 4000, 8000, 16000
      const delays = [0, 1, 2, 3, 4].map((attempt) =>
        calculateBackoffDelay(attempt, { ...defaultConfig, jitterFactor: 0 }),
      );

      expect(delays[0]).toBe(1000);
      expect(delays[1]).toBe(2000);
      expect(delays[2]).toBe(4000);
      expect(delays[3]).toBe(8000);
      expect(delays[4]).toBe(16000);
    });

    it('should cap delay at maxDelayMs', () => {
      const delay = calculateBackoffDelay(10, {
        ...defaultConfig,
        jitterFactor: 0,
      });

      expect(delay).toBe(defaultConfig.maxDelayMs);
    });

    it('should add jitter within expected range', () => {
      const baseDelay = 1000;
      const jitterFactor = 0.2;

      // Run multiple times to test jitter randomness
      for (let i = 0; i < 10; i++) {
        const delay = calculateBackoffDelay(0, {
          ...defaultConfig,
          jitterFactor,
        });

        // Delay should be between baseDelay and baseDelay * (1 + jitterFactor)
        expect(delay).toBeGreaterThanOrEqual(baseDelay);
        expect(delay).toBeLessThanOrEqual(baseDelay * (1 + jitterFactor));
      }
    });

    it('should return integer values', () => {
      for (let i = 0; i < 10; i++) {
        const delay = calculateBackoffDelay(i % 5, defaultConfig);
        expect(Number.isInteger(delay)).toBe(true);
      }
    });
  });
});
