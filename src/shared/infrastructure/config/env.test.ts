import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Environment Configuration', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('should load default environment variables', async () => {
    process.env.NODE_ENV = 'test';
    
    // Dynamically import to test evaluation
    const { env } = await import('./env');
    
    expect(env.NODE_ENV).toBe('test');
    expect(env.PORT).toBe(3000);
    expect(env.LOG_LEVEL).toBe('info');
  });
});