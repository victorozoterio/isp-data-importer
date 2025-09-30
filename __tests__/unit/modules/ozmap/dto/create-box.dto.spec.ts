import { CreateBoxDto } from '../../../../../src/modules/ozmap/dto/create-box.dto';

describe('CreateBoxDto', () => {
  it('should be defined', () => {
    expect(CreateBoxDto).toBeDefined();
  });

  it('should be a class', () => {
    expect(typeof CreateBoxDto).toBe('function');
  });

  describe('instance creation', () => {
    it('should create instance with required properties', () => {
      const dto = new CreateBoxDto();
      dto.id = 1;
      dto.boxType = 'FIBER';
      dto.coords = [-23.5505, -46.6333];

      expect(dto.id).toBe(1);
      expect(dto.boxType).toBe('FIBER');
      expect(dto.coords).toEqual([-23.5505, -46.6333]);
    });

    it('should create instance with all properties', () => {
      const dto = new CreateBoxDto();
      dto.id = 1;
      dto.name = 'Test Box';
      dto.boxType = 'FIBER';
      dto.coords = [-23.5505, -46.6333];

      expect(dto.id).toBe(1);
      expect(dto.name).toBe('Test Box');
      expect(dto.boxType).toBe('FIBER');
      expect(dto.coords).toEqual([-23.5505, -46.6333]);
    });

    it('should allow optional name property to be undefined', () => {
      const dto = new CreateBoxDto();
      dto.id = 1;
      dto.boxType = 'FIBER';
      dto.coords = [-23.5505, -46.6333];

      expect(dto.name).toBeUndefined();
    });

    it('should handle different box types', () => {
      const dto = new CreateBoxDto();
      dto.id = 1;
      dto.boxType = 'COPPER';
      dto.coords = [-23.5505, -46.6333];

      expect(dto.boxType).toBe('COPPER');
    });

    it('should handle different coordinate arrays', () => {
      const dto = new CreateBoxDto();
      dto.id = 1;
      dto.boxType = 'FIBER';
      dto.coords = [0, 0];

      expect(dto.coords).toEqual([0, 0]);
    });
  });

  describe('property types', () => {
    it('should have correct property types', () => {
      const dto = new CreateBoxDto();

      dto.id = 1;
      dto.name = 'Test';
      dto.boxType = 'FIBER';
      dto.coords = [-23.5505, -46.6333];

      expect(typeof dto.id).toBe('number');
      expect(typeof dto.name).toBe('string');
      expect(typeof dto.boxType).toBe('string');
      expect(Array.isArray(dto.coords)).toBe(true);
    });
  });
});
