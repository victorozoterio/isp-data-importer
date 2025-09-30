import { Test, TestingModule } from '@nestjs/testing';
import { OzmapController } from '../../../../src/modules/ozmap/ozmap.controller';
import { OzmapService } from '../../../../src/modules/ozmap/ozmap.service';
import { BoxDocument } from '../../../../src/modules/ozmap/schemas/box.schema';
import { CableDocument } from '../../../../src/modules/ozmap/schemas/cable.schema';
import { Types } from 'mongoose';

describe('OzmapController', () => {
  let controller: OzmapController;
  let service: jest.Mocked<OzmapService>;

  const mockSynchronizationResult = {
    boxes: [
      {
        _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
        ispId: 1,
        name: 'Test Box',
        boxType: 'FIBER',
        coords: [-23.5505, -46.6333],
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      } as Partial<BoxDocument>,
    ],
    cables: [
      {
        _id: new Types.ObjectId('507f1f77bcf86cd799439012'),
        ispId: 1,
        name: 'Test Cable',
        cableType: '1000',
        boxA: new Types.ObjectId('507f1f77bcf86cd799439011'),
        boxB: new Types.ObjectId('507f1f77bcf86cd799439013'),
        poles: [
          { lat: -23.5505, lng: -46.6333 },
          { lat: -23.5506, lng: -46.6334 },
        ],
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      } as Partial<CableDocument>,
    ],
  };

  beforeEach(async () => {
    const mockOzmapService = {
      synchronize: jest.fn().mockResolvedValue(mockSynchronizationResult),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OzmapController],
      providers: [
        {
          provide: OzmapService,
          useValue: mockOzmapService,
        },
      ],
    }).compile();

    controller = module.get<OzmapController>(OzmapController);
    service = module.get(OzmapService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('synchronize', () => {
    it('should return synchronization result', async () => {
      const result = await controller.synchronize();

      expect(result).toEqual(mockSynchronizationResult);
      expect(service.synchronize).toHaveBeenCalledTimes(1);
    });

    it('should propagate service errors', async () => {
      const error = new Error('Synchronization failed');
      service.synchronize.mockRejectedValue(error);

      await expect(controller.synchronize()).rejects.toThrow('Synchronization failed');
      expect(service.synchronize).toHaveBeenCalledTimes(1);
    });
  });
});
