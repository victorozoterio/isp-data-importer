import { Test, TestingModule } from '@nestjs/testing';
import { OzmapService, OZMAP_SDK, OzmapSdk } from '../../../../src/modules/ozmap/ozmap.service';
import { IspService } from '../../../../src/modules/isp/isp.service';
import { OzmapRepository } from '../../../../src/modules/ozmap/ozmap.repository';
import { BoxDocument } from '../../../../src/modules/ozmap/schemas/box.schema';
import { CableDocument } from '../../../../src/modules/ozmap/schemas/cable.schema';
import { Types } from 'mongoose';

describe('OzmapService', () => {
  let service: OzmapService;
  let ispService: jest.Mocked<IspService>;
  let ozmapRepository: jest.Mocked<OzmapRepository>;
  let ozmapSdk: jest.Mocked<OzmapSdk>;

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
    drop_cables: [],
    boxes: [
      {
        id: 1,
        name: 'Box 1',
        type: 'FIBER',
        lat: -23.5505,
        lng: -46.6333,
      },
      {
        id: 2,
        name: 'Box 2',
        type: 'FIBER',
        lat: -23.5506,
        lng: -46.6334,
      },
    ],
    customers: [],
  };

  const mockBoxResponse: Partial<BoxDocument> = {
    _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
    ispId: 1,
    name: 'Box 1',
    boxType: 'FIBER',
    coords: [-23.5505, -46.6333],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  const mockCableResponse: Partial<CableDocument> = {
    _id: new Types.ObjectId('507f1f77bcf86cd799439012'),
    ispId: 1,
    name: 'Cable 1',
    cableType: '1000',
    boxA: new Types.ObjectId('507f1f77bcf86cd799439011'),
    boxB: new Types.ObjectId('507f1f77bcf86cd799439013'),
    poles: [
      { lat: -23.5505, lng: -46.6333 },
      { lat: -23.5506, lng: -46.6334 },
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  beforeEach(async () => {
    const mockIspService = {
      getAll: jest.fn(),
    };

    const mockOzmapRepository = {
      findBoxByIspId: jest.fn(),
      findCableByIspId: jest.fn(),
      saveBox: jest.fn(),
      saveCable: jest.fn(),
    };

    const mockOzmapSdk: jest.Mocked<OzmapSdk> = {
      box: {
        create: jest.fn().mockResolvedValue({
          id: 1,
          name: 'Box 1',
          boxType: 'FIBER',
          coords: [-23.5505, -46.6333],
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        }),
      },
      cable: {
        create: jest.fn().mockResolvedValue({
          id: 1,
          name: 'Cable 1',
          cableType: '1000',
          boxA: '1',
          boxB: '2',
          poles: [
            { lat: -23.5505, lng: -46.6333 },
            { lat: -23.5506, lng: -46.6334 },
          ],
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        }),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OzmapService,
        {
          provide: IspService,
          useValue: mockIspService,
        },
        {
          provide: OzmapRepository,
          useValue: mockOzmapRepository,
        },
        {
          provide: OZMAP_SDK,
          useValue: mockOzmapSdk,
        },
      ],
    }).compile();

    service = module.get<OzmapService>(OzmapService);
    ispService = module.get(IspService);
    ozmapRepository = module.get(OzmapRepository);
    ozmapSdk = module.get(OZMAP_SDK);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('synchronize', () => {
    it('should synchronize data successfully', async () => {
      ispService.getAll.mockResolvedValue(mockIspData);
      ozmapRepository.findBoxByIspId.mockResolvedValue(null);
      ozmapRepository.findCableByIspId.mockResolvedValue(null);
      ozmapRepository.saveBox.mockResolvedValue(mockBoxResponse as BoxDocument);
      ozmapRepository.saveCable.mockResolvedValue(mockCableResponse as CableDocument);

      const result = await service.synchronize();

      expect(result.boxes).toHaveLength(2);
      expect(result.cables).toHaveLength(1);
      expect(result.boxes[0]).toMatchObject({
        ispId: 1,
        name: 'Box 1',
        boxType: 'FIBER',
      });
      expect(result.cables[0]).toMatchObject({
        ispId: 1,
        name: 'Cable 1',
        cableType: '1000',
      });
      expect(ispService.getAll).toHaveBeenCalledTimes(1);
      expect(ozmapSdk.box.create).toHaveBeenCalledTimes(2);
      expect(ozmapSdk.cable.create).toHaveBeenCalledTimes(1);
      expect(ozmapRepository.saveBox).toHaveBeenCalledTimes(2);
      expect(ozmapRepository.saveCable).toHaveBeenCalledTimes(1);
    });

    it('should skip existing boxes and cables', async () => {
      ispService.getAll.mockResolvedValue(mockIspData);
      ozmapRepository.findBoxByIspId.mockResolvedValue(mockBoxResponse as BoxDocument);
      ozmapRepository.findCableByIspId.mockResolvedValue(mockCableResponse as CableDocument);

      const result = await service.synchronize();

      expect(result).toEqual({
        boxes: [mockBoxResponse, mockBoxResponse],
        cables: [mockCableResponse],
      });
      expect(ozmapSdk.box.create).not.toHaveBeenCalled();
      expect(ozmapSdk.cable.create).not.toHaveBeenCalled();
      expect(ozmapRepository.saveBox).not.toHaveBeenCalled();
      expect(ozmapRepository.saveCable).not.toHaveBeenCalled();
    });

    it('should handle ISP service errors', async () => {
      const error = new Error('ISP service error');
      ispService.getAll.mockRejectedValue(error);

      await expect(service.synchronize()).rejects.toThrow('ISP service error');
    });
  });

  describe('createBoxes', () => {
    it('should create new boxes successfully', async () => {
      const boxDtos = [
        {
          id: 1,
          name: 'Box 1',
          boxType: 'FIBER',
          coords: [-23.5505, -46.6333],
        },
      ];

      ozmapRepository.findBoxByIspId.mockResolvedValue(null);
      ozmapRepository.saveBox.mockResolvedValue(mockBoxResponse as BoxDocument);

      const result = await service.createBoxes(boxDtos);

      expect(result).toEqual({
        results: [mockBoxResponse],
        createdCount: 1,
        skippedCount: 0,
      });
      expect(ozmapRepository.findBoxByIspId).toHaveBeenCalledWith(1);
      expect(ozmapSdk.box.create).toHaveBeenCalledWith(boxDtos[0]);
      expect(ozmapRepository.saveBox).toHaveBeenCalledTimes(1);
    });

    it('should skip existing boxes', async () => {
      const boxDtos = [
        {
          id: 1,
          name: 'Box 1',
          boxType: 'FIBER',
          coords: [-23.5505, -46.6333],
        },
      ];

      ozmapRepository.findBoxByIspId.mockResolvedValue(mockBoxResponse as BoxDocument);

      const result = await service.createBoxes(boxDtos);

      expect(result).toEqual({
        results: [mockBoxResponse],
        createdCount: 0,
        skippedCount: 1,
      });
      expect(ozmapSdk.box.create).not.toHaveBeenCalled();
      expect(ozmapRepository.saveBox).not.toHaveBeenCalled();
    });
  });

  describe('createCables', () => {
    it('should create new cables successfully', async () => {
      const cableDtos = [
        {
          id: 1,
          name: 'Cable 1',
          cableType: '1000',
          boxA: 1,
          boxB: 2,
          poles: [
            { lat: -23.5505, lng: -46.6333 },
            { lat: -23.5506, lng: -46.6334 },
          ],
        },
      ];

      const boxIdMapping = new Map<number, string>();
      boxIdMapping.set(1, 'boxA_id');
      boxIdMapping.set(2, 'boxB_id');

      ozmapRepository.findCableByIspId.mockResolvedValue(null);
      ozmapRepository.saveCable.mockResolvedValue(mockCableResponse as CableDocument);

      const result = await service.createCables(cableDtos, boxIdMapping);

      expect(result).toEqual({
        results: [mockCableResponse],
        createdCount: 1,
        skippedCount: 0,
      });
      expect(ozmapRepository.findCableByIspId).toHaveBeenCalledWith(1);
      expect(ozmapSdk.cable.create).toHaveBeenCalledWith(cableDtos[0]);
      expect(ozmapRepository.saveCable).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          name: 'Cable 1',
          cableType: '1000',
          boxA: '1',
          boxB: '2',
          poles: [
            { lat: -23.5505, lng: -46.6333 },
            { lat: -23.5506, lng: -46.6334 },
          ],
        }),
        'boxA_id',
        'boxB_id',
      );
    });

    it('should skip existing cables', async () => {
      const cableDtos = [
        {
          id: 1,
          name: 'Cable 1',
          cableType: '1000',
          boxA: 1,
          boxB: 2,
          poles: [
            { lat: -23.5505, lng: -46.6333 },
            { lat: -23.5506, lng: -46.6334 },
          ],
        },
      ];

      ozmapRepository.findCableByIspId.mockResolvedValue(mockCableResponse as CableDocument);

      const result = await service.createCables(cableDtos);

      expect(result).toEqual({
        results: [mockCableResponse],
        createdCount: 0,
        skippedCount: 1,
      });
      expect(ozmapSdk.cable.create).not.toHaveBeenCalled();
      expect(ozmapRepository.saveCable).not.toHaveBeenCalled();
    });
  });
});
