import { describe, it, expect } from 'vitest';

describe('基础测试', () => {
  it('应该能正常运行测试', () => {
    expect(1 + 1).toBe(2);
  });

  it('应该能测试字符串', () => {
    expect('hello world').toContain('world');
  });
});