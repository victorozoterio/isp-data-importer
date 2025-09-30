import { swaggerConfig } from '../../../src/config/swagger';

describe('SwaggerConfig', () => {
  it('should create a valid DocumentBuilder configuration', () => {
    expect(swaggerConfig).toBeDefined();
    expect(swaggerConfig).toHaveProperty('info');
  });

  it('should have correct title', () => {
    expect(swaggerConfig.info.title).toBe('ISP Data Importer');
  });

  it('should have correct description', () => {
    expect(swaggerConfig.info.description).toBe(
      'This application integrates data from a fictitious network management system with OZmap.',
    );
  });

  it('should have valid configuration structure', () => {
    expect(swaggerConfig.info).toBeDefined();
    expect(swaggerConfig.info.title).toBeDefined();
    expect(swaggerConfig.info.description).toBeDefined();
  });
});
