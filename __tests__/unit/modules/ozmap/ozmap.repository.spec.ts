import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { OzmapRepository } from '../../../../src/modules/ozmap/ozmap.repository';
import { Box, BoxDocument } from '../../../../src/modules/ozmap/schemas/box.schema';
import { Cable, CableDocument } from '../../../../src/modules/ozmap/schemas/cable.schema';
import { Types } from 'mongoose';

type MockModel = {
  findOne: jest.Mock;
  find: jest.Mock;
  populate?: jest.Mock;
  constructor: jest.Mock;
  mockImplementation: jest.Mock;
};

describe('OzmapRepository', () => {
  let repository: OzmapRepository;
  let boxModel: MockModel;
  let cableModel: MockModel;

  const mockBox = {
    id: 1,
    name: 'Test Box',
    boxType: 'FIBER',
    coords: [-23.5505, -46.6333],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  const mockCable = {
    id: 1,
    name: 'Test Cable',
    cableType: '1000',
    boxA: '1',
    boxB: '2',
    poles: [
      { lat: -23.5505, lng: -46.6333 },
      { lat: -23.5506, lng: -46.6334 },
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  const mockBoxDocument: Partial<BoxDocument> = {
    _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
    ispId: 1,
    name: 'Test Box',
    boxType: 'FIBER',
    coords: [-23.5505, -46.6333],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    save: jest.fn(),
  };

  const mockCableDocument: Partial<CableDocument> = {
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
    save: jest.fn(),
  };

  beforeEach(async () => {
    const mockBoxModel = jest.fn().mockImplementation((data) => ({
      ...mockBoxDocument,
      ...data,
      save: jest.fn().mockResolvedValue(mockBoxDocument),
    }));

    const mockCableModel = jest.fn().mockImplementation((data) => ({
      ...mockCableDocument,
      ...data,
      save: jest.fn().mockResolvedValue(mockCableDocument),
    }));

    Object.assign(mockBoxModel, {
      findOne: jest.fn(),
      find: jest.fn(),
    });

    Object.assign(mockCableModel, {
      findOne: jest.fn(),
      find: jest.fn(),
      populate: jest.fn(),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OzmapRepository,
        {
          provide: getModelToken(Box.name),
          useValue: mockBoxModel,
        },
        {
          provide: getModelToken(Cable.name),
          useValue: mockCableModel,
        },
      ],
    }).compile();

    repository = module.get<OzmapRepository>(OzmapRepository);
    boxModel = module.get(getModelToken(Box.name));
    cableModel = module.get(getModelToken(Cable.name));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('saveBox', () => {
    it('should save a box successfully', async () => {
      const mockSave = jest.fn().mockResolvedValue(mockBoxDocument);
      boxModel.mockImplementation(() => ({
        save: mockSave,
      }));

      const result = await repository.saveBox(mockBox);

      expect(result).toEqual(mockBoxDocument);
      expect(boxModel).toHaveBeenCalledWith({
        ispId: mockBox.id,
        name: mockBox.name,
        boxType: mockBox.boxType,
        coords: mockBox.coords,
        createdAt: mockBox.createdAt,
        updatedAt: mockBox.updatedAt,
      });
    });

    it('should throw error when save fails', async () => {
      const error = new Error('Database error');
      const mockSave = jest.fn().mockRejectedValue(error);
      boxModel.mockImplementation(() => ({
        save: mockSave,
      }));

      await expect(repository.saveBox(mockBox)).rejects.toThrow('Database error');
    });
  });

  describe('saveCable', () => {
    it('should save a cable successfully', async () => {
      const mockSave = jest.fn().mockResolvedValue(mockCableDocument);
      cableModel.mockImplementation(() => ({
        save: mockSave,
      }));

      const result = await repository.saveCable(mockCable, 'boxA_id', 'boxB_id');

      expect(result).toEqual(mockCableDocument);
      expect(cableModel).toHaveBeenCalledWith({
        ispId: mockCable.id,
        name: mockCable.name,
        cableType: mockCable.cableType,
        boxA: 'boxA_id',
        boxB: 'boxB_id',
        poles: mockCable.poles,
        createdAt: mockCable.createdAt,
        updatedAt: mockCable.updatedAt,
      });
    });

    it('should save a cable without box references', async () => {
      const mockSave = jest.fn().mockResolvedValue(mockCableDocument);
      cableModel.mockImplementation(() => ({
        save: mockSave,
      }));

      const result = await repository.saveCable(mockCable);

      expect(result).toEqual(mockCableDocument);
      expect(cableModel).toHaveBeenCalledWith({
        ispId: mockCable.id,
        name: mockCable.name,
        cableType: mockCable.cableType,
        boxA: undefined,
        boxB: undefined,
        poles: mockCable.poles,
        createdAt: mockCable.createdAt,
        updatedAt: mockCable.updatedAt,
      });
    });

    it('should throw error when save fails', async () => {
      const error = new Error('Database error');
      const mockSave = jest.fn().mockRejectedValue(error);
      cableModel.mockImplementation(() => ({
        save: mockSave,
      }));

      await expect(repository.saveCable(mockCable)).rejects.toThrow('Database error');
    });
  });

  describe('findBoxByIspId', () => {
    it('should find a box by ISP ID', async () => {
      boxModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockBoxDocument),
      });

      const result = await repository.findBoxByIspId(1);

      expect(result).toEqual(mockBoxDocument);
      expect(boxModel.findOne).toHaveBeenCalledWith({ ispId: 1 });
    });

    it('should return null when box not found', async () => {
      boxModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await repository.findBoxByIspId(999);

      expect(result).toBeNull();
      expect(boxModel.findOne).toHaveBeenCalledWith({ ispId: 999 });
    });
  });

  describe('findCableByIspId', () => {
    it('should find a cable by ISP ID', async () => {
      cableModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCableDocument),
      });

      const result = await repository.findCableByIspId(1);

      expect(result).toEqual(mockCableDocument);
      expect(cableModel.findOne).toHaveBeenCalledWith({ ispId: 1 });
    });

    it('should return null when cable not found', async () => {
      cableModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await repository.findCableByIspId(999);

      expect(result).toBeNull();
      expect(cableModel.findOne).toHaveBeenCalledWith({ ispId: 999 });
    });
  });

  describe('getAllBoxes', () => {
    it('should return all boxes', async () => {
      const mockBoxes = [mockBoxDocument];
      boxModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockBoxes),
      });

      const result = await repository.getAllBoxes();

      expect(result).toEqual(mockBoxes);
      expect(boxModel.find).toHaveBeenCalledWith();
    });
  });

  describe('getAllCables', () => {
    it('should return all cables with populated references', async () => {
      const mockCables = [mockCableDocument];
      const mockPopulate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCables),
      });
      cableModel.find.mockReturnValue({
        populate: mockPopulate,
      });

      const result = await repository.getAllCables();

      expect(result).toEqual(mockCables);
      expect(cableModel.find).toHaveBeenCalledWith();
      expect(mockPopulate).toHaveBeenCalledWith('boxA boxB');
    });
  });
});
