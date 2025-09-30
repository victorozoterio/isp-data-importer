import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from '../../../../src/modules/health/health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('check', () => {
    it('should return health status', () => {
      const result = controller.check();

      expect(result).toEqual({ status: 'ok' });
    });

    it('should return an object with status property', () => {
      const result = controller.check();

      expect(result).toHaveProperty('status');
      expect(typeof result.status).toBe('string');
    });

    it('should always return the same health status', () => {
      const result1 = controller.check();
      const result2 = controller.check();

      expect(result1).toEqual(result2);
    });
  });
});
