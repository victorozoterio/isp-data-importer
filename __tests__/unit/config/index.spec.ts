import * as configIndex from '../../../src/config/index';

describe('Config Index', () => {
  it('should export swaggerConfig', () => {
    expect(configIndex).toHaveProperty('swaggerConfig');
    expect(configIndex.swaggerConfig).toBeDefined();
  });

  it('should have correct export structure', () => {
    const exports = Object.keys(configIndex);
    expect(exports).toContain('swaggerConfig');
    expect(exports).toHaveLength(1);
  });
});
