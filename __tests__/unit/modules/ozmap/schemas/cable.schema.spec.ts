import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Cable, CableDocument, CableSchema } from '../../../../../src/modules/ozmap/schemas/cable.schema';
import { Types } from 'mongoose';

describe('Cable Schema', () => {
  beforeEach(async () => {
    const mockCableModel = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      constructor: jest.fn(),
    };

    await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(Cable.name),
          useValue: mockCableModel,
        },
      ],
    }).compile();
  });

  it('should be defined', () => {
    expect(Cable).toBeDefined();
    expect(CableSchema).toBeDefined();
  });

  it('should be a class', () => {
    expect(typeof Cable).toBe('function');
  });

  describe('Cable class', () => {
    it('should create instance with required properties', () => {
      const cable = new Cable();
      cable.ispId = 1;
      cable.poles = [{ lat: -23.5505, lng: -46.6333 }];
      cable.createdAt = '2024-01-01T00:00:00.000Z';
      cable.updatedAt = '2024-01-01T00:00:00.000Z';

      expect(cable.ispId).toBe(1);
      expect(cable.poles).toEqual([{ lat: -23.5505, lng: -46.6333 }]);
      expect(cable.createdAt).toBe('2024-01-01T00:00:00.000Z');
      expect(cable.updatedAt).toBe('2024-01-01T00:00:00.000Z');
    });

    it('should create instance with all properties', () => {
      const cable = new Cable();
      cable.ispId = 1;
      cable.name = 'Test Cable';
      cable.cableType = '1000';
      cable.boxA = new Types.ObjectId();
      cable.boxB = new Types.ObjectId();
      cable.poles = [
        { lat: -23.5505, lng: -46.6333 },
        { lat: -23.5506, lng: -46.6334 },
      ];
      cable.createdAt = '2024-01-01T00:00:00.000Z';
      cable.updatedAt = '2024-01-01T00:00:00.000Z';

      expect(cable.ispId).toBe(1);
      expect(cable.name).toBe('Test Cable');
      expect(cable.cableType).toBe('1000');
      expect(cable.boxA).toBeInstanceOf(Types.ObjectId);
      expect(cable.boxB).toBeInstanceOf(Types.ObjectId);
      expect(cable.poles).toHaveLength(2);
      expect(cable.createdAt).toBe('2024-01-01T00:00:00.000Z');
      expect(cable.updatedAt).toBe('2024-01-01T00:00:00.000Z');
    });

    it('should allow optional properties to be undefined', () => {
      const cable = new Cable();
      cable.ispId = 1;
      cable.poles = [{ lat: -23.5505, lng: -46.6333 }];
      cable.createdAt = '2024-01-01T00:00:00.000Z';
      cable.updatedAt = '2024-01-01T00:00:00.000Z';

      expect(cable.name).toBeUndefined();
      expect(cable.cableType).toBeUndefined();
      expect(cable.boxA).toBeUndefined();
      expect(cable.boxB).toBeUndefined();
    });

    it('should handle different cable types', () => {
      const cable = new Cable();
      cable.ispId = 1;
      cable.cableType = '500';
      cable.poles = [{ lat: -23.5505, lng: -46.6333 }];
      cable.createdAt = '2024-01-01T00:00:00.000Z';
      cable.updatedAt = '2024-01-01T00:00:00.000Z';

      expect(cable.cableType).toBe('500');
    });

    it('should handle different pole configurations', () => {
      const cable = new Cable();
      cable.ispId = 1;
      cable.poles = [
        { lat: 0, lng: 0 },
        { lat: 1, lng: 1 },
        { lat: 2, lng: 2 },
      ];
      cable.createdAt = '2024-01-01T00:00:00.000Z';
      cable.updatedAt = '2024-01-01T00:00:00.000Z';

      expect(cable.poles).toHaveLength(3);
      expect(cable.poles[0]).toEqual({ lat: 0, lng: 0 });
    });

    it('should handle ObjectId references for boxes', () => {
      const boxAId = new Types.ObjectId();
      const boxBId = new Types.ObjectId();

      const cable = new Cable();
      cable.ispId = 1;
      cable.boxA = boxAId;
      cable.boxB = boxBId;
      cable.poles = [{ lat: -23.5505, lng: -46.6333 }];
      cable.createdAt = '2024-01-01T00:00:00.000Z';
      cable.updatedAt = '2024-01-01T00:00:00.000Z';

      expect(cable.boxA).toBe(boxAId);
      expect(cable.boxB).toBe(boxBId);
    });
  });

  describe('CableDocument type', () => {
    it('should extend Document', () => {
      const mockDocument: Partial<CableDocument> = {
        _id: new Types.ObjectId(),
        ispId: 1,
        name: 'Test Cable',
        cableType: '1000',
        boxA: new Types.ObjectId(),
        boxB: new Types.ObjectId(),
        poles: [{ lat: -23.5505, lng: -46.6333 }],
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        save: jest.fn(),
      };

      expect(mockDocument._id).toBeInstanceOf(Types.ObjectId);
      expect(mockDocument.ispId).toBe(1);
      expect(mockDocument.boxA).toBeInstanceOf(Types.ObjectId);
      expect(mockDocument.boxB).toBeInstanceOf(Types.ObjectId);
      expect(typeof mockDocument.save).toBe('function');
    });
  });

  describe('property types', () => {
    it('should have correct property types', () => {
      const cable = new Cable();
      cable.ispId = 1;
      cable.name = 'Test';
      cable.cableType = '1000';
      cable.boxA = new Types.ObjectId();
      cable.boxB = new Types.ObjectId();
      cable.poles = [{ lat: -23.5505, lng: -46.6333 }];
      cable.createdAt = '2024-01-01T00:00:00.000Z';
      cable.updatedAt = '2024-01-01T00:00:00.000Z';

      expect(typeof cable.ispId).toBe('number');
      expect(typeof cable.name).toBe('string');
      expect(typeof cable.cableType).toBe('string');
      expect(cable.boxA).toBeInstanceOf(Types.ObjectId);
      expect(cable.boxB).toBeInstanceOf(Types.ObjectId);
      expect(Array.isArray(cable.poles)).toBe(true);
      expect(typeof cable.poles[0].lat).toBe('number');
      expect(typeof cable.poles[0].lng).toBe('number');
      expect(typeof cable.createdAt).toBe('string');
      expect(typeof cable.updatedAt).toBe('string');
    });
  });
});
