import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Box, BoxDocument, BoxSchema } from '../../../../../src/modules/ozmap/schemas/box.schema';
import { Types } from 'mongoose';

describe('Box Schema', () => {
  beforeEach(async () => {
    const mockBoxModel = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      constructor: jest.fn(),
    };

    await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(Box.name),
          useValue: mockBoxModel,
        },
      ],
    }).compile();
  });

  it('should be defined', () => {
    expect(Box).toBeDefined();
    expect(BoxSchema).toBeDefined();
  });

  it('should be a class', () => {
    expect(typeof Box).toBe('function');
  });

  describe('Box class', () => {
    it('should create instance with required properties', () => {
      const box = new Box();
      box.ispId = 1;
      box.createdAt = '2024-01-01T00:00:00.000Z';
      box.updatedAt = '2024-01-01T00:00:00.000Z';

      expect(box.ispId).toBe(1);
      expect(box.createdAt).toBe('2024-01-01T00:00:00.000Z');
      expect(box.updatedAt).toBe('2024-01-01T00:00:00.000Z');
    });

    it('should create instance with all properties', () => {
      const box = new Box();
      box.ispId = 1;
      box.name = 'Test Box';
      box.boxType = 'FIBER';
      box.coords = [-23.5505, -46.6333];
      box.createdAt = '2024-01-01T00:00:00.000Z';
      box.updatedAt = '2024-01-01T00:00:00.000Z';

      expect(box.ispId).toBe(1);
      expect(box.name).toBe('Test Box');
      expect(box.boxType).toBe('FIBER');
      expect(box.coords).toEqual([-23.5505, -46.6333]);
      expect(box.createdAt).toBe('2024-01-01T00:00:00.000Z');
      expect(box.updatedAt).toBe('2024-01-01T00:00:00.000Z');
    });

    it('should allow optional properties to be undefined', () => {
      const box = new Box();
      box.ispId = 1;
      box.createdAt = '2024-01-01T00:00:00.000Z';
      box.updatedAt = '2024-01-01T00:00:00.000Z';

      expect(box.name).toBeUndefined();
      expect(box.boxType).toBeUndefined();
      expect(box.coords).toBeUndefined();
    });

    it('should handle different box types', () => {
      const box = new Box();
      box.ispId = 1;
      box.boxType = 'COPPER';
      box.createdAt = '2024-01-01T00:00:00.000Z';
      box.updatedAt = '2024-01-01T00:00:00.000Z';

      expect(box.boxType).toBe('COPPER');
    });

    it('should handle different coordinate arrays', () => {
      const box = new Box();
      box.ispId = 1;
      box.coords = [0, 0, 0];
      box.createdAt = '2024-01-01T00:00:00.000Z';
      box.updatedAt = '2024-01-01T00:00:00.000Z';

      expect(box.coords).toEqual([0, 0, 0]);
    });
  });

  describe('BoxDocument type', () => {
    it('should extend Document', () => {
      const mockDocument: Partial<BoxDocument> = {
        _id: new Types.ObjectId(),
        ispId: 1,
        name: 'Test Box',
        boxType: 'FIBER',
        coords: [-23.5505, -46.6333],
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        save: jest.fn(),
      };

      expect(mockDocument._id).toBeInstanceOf(Types.ObjectId);
      expect(mockDocument.ispId).toBe(1);
      expect(typeof mockDocument.save).toBe('function');
    });
  });

  describe('property types', () => {
    it('should have correct property types', () => {
      const box = new Box();
      box.ispId = 1;
      box.name = 'Test';
      box.boxType = 'FIBER';
      box.coords = [-23.5505, -46.6333];
      box.createdAt = '2024-01-01T00:00:00.000Z';
      box.updatedAt = '2024-01-01T00:00:00.000Z';

      expect(typeof box.ispId).toBe('number');
      expect(typeof box.name).toBe('string');
      expect(typeof box.boxType).toBe('string');
      expect(Array.isArray(box.coords)).toBe(true);
      expect(typeof box.createdAt).toBe('string');
      expect(typeof box.updatedAt).toBe('string');
    });
  });
});
