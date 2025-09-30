import { Test, TestingModule } from '@nestjs/testing';
import { IspController } from '../../../../src/modules/isp/isp.controller';
import { IspService } from '../../../../src/modules/isp/isp.service';

describe('IspController', () => {
  let controller: IspController;
  let service: jest.Mocked<IspService>;

  const mockIspData = {
    cables: [
      {
        id: 1,
        name: 'Cable 1',
        capacity: 1000,
        boxes_connected: [1, 2],
        path: [
          { lat: -23.5505, lng: -46.6333 },
          { lat: -23.5506, lng: -46.6334 },
        ],
      },
    ],
    drop_cables: [
      {
        id: 1,
        name: 'Drop Cable 1',
        customer_id: 1,
        box_id: 1,
      },
    ],
    boxes: [
      {
        id: 1,
        name: 'Box 1',
        type: 'FIBER',
        lat: -23.5505,
        lng: -46.6333,
      },
    ],
    customers: [
      {
        id: 1,
        code: 'CUST001',
        name: 'Customer 1',
        address: 'Address 1',
        box_id: 1,
      },
    ],
  };

  beforeEach(async () => {
    const mockIspService = {
      getAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [IspController],
      providers: [
        {
          provide: IspService,
          useValue: mockIspService,
        },
      ],
    }).compile();

    controller = module.get<IspController>(IspController);
    service = module.get(IspService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return all ISP data', async () => {
      service.getAll.mockResolvedValue(mockIspData);

      const result = await controller.getAll();

      expect(result).toEqual(mockIspData);
      expect(service.getAll).toHaveBeenCalledTimes(1);
    });

    it('should propagate service errors', async () => {
      const error = new Error('Service error');
      service.getAll.mockRejectedValue(error);

      await expect(controller.getAll()).rejects.toThrow('Service error');
      expect(service.getAll).toHaveBeenCalledTimes(1);
    });
  });
});
