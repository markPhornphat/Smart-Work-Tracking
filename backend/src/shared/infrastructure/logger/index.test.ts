import { describe, it, expect } from 'vitest';
import { logger } from './index';

describe('Logger', () => {
  it('should be created with expected structure', () => {
    expect(logger).toBeDefined();
    expect(logger.info).toBeTypeOf('function');
    expect(logger.error).toBeTypeOf('function');
  });
});