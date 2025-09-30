import { CreateCableDto } from '../../../../../src/modules/ozmap/dto/create-cable.dto';

describe('CreateCableDto', () => {
  it('should be defined', () => {
    const dto: CreateCableDto = {
      id: 1,
      cableType: '1000',
      poles: [{ lat: -23.5505, lng: -46.6333 }],
    };

    expect(dto).toBeDefined();
  });

  it('should be an interface', () => {
    const dto: CreateCableDto = {
      id: 1,
      cableType: '1000',
      poles: [{ lat: -23.5505, lng: -46.6333 }],
    };

    expect(dto).toBeDefined();
  });

  describe('interface structure', () => {
    it('should accept required properties', () => {
      const dto: CreateCableDto = {
        id: 1,
        cableType: '1000',
        poles: [{ lat: -23.5505, lng: -46.6333 }],
      };

      expect(dto.id).toBe(1);
      expect(dto.cableType).toBe('1000');
      expect(dto.poles).toEqual([{ lat: -23.5505, lng: -46.6333 }]);
    });

    it('should accept all properties', () => {
      const dto: CreateCableDto = {
        id: 1,
        name: 'Test Cable',
        cableType: '1000',
        boxA: 1,
        boxB: 2,
        poles: [
          { lat: -23.5505, lng: -46.6333 },
          { lat: -23.5506, lng: -46.6334 },
        ],
      };

      expect(dto.id).toBe(1);
      expect(dto.name).toBe('Test Cable');
      expect(dto.cableType).toBe('1000');
      expect(dto.boxA).toBe(1);
      expect(dto.boxB).toBe(2);
      expect(dto.poles).toHaveLength(2);
    });

    it('should allow optional properties to be undefined', () => {
      const dto: CreateCableDto = {
        id: 1,
        cableType: '1000',
        poles: [{ lat: -23.5505, lng: -46.6333 }],
      };

      expect(dto.name).toBeUndefined();
      expect(dto.boxA).toBeUndefined();
      expect(dto.boxB).toBeUndefined();
    });

    it('should handle different cable types', () => {
      const dto: CreateCableDto = {
        id: 1,
        cableType: '500',
        poles: [{ lat: -23.5505, lng: -46.6333 }],
      };

      expect(dto.cableType).toBe('500');
    });

    it('should handle different pole configurations', () => {
      const dto: CreateCableDto = {
        id: 1,
        cableType: '1000',
        poles: [
          { lat: 0, lng: 0 },
          { lat: 1, lng: 1 },
          { lat: 2, lng: 2 },
        ],
      };

      expect(dto.poles).toHaveLength(3);
      expect(dto.poles[0]).toEqual({ lat: 0, lng: 0 });
    });
  });

  describe('property types', () => {
    it('should have correct property types', () => {
      const dto: CreateCableDto = {
        id: 1,
        name: 'Test',
        cableType: '1000',
        boxA: 1,
        boxB: 2,
        poles: [{ lat: -23.5505, lng: -46.6333 }],
      };

      expect(typeof dto.id).toBe('number');
      expect(typeof dto.name).toBe('string');
      expect(typeof dto.cableType).toBe('string');
      expect(typeof dto.boxA).toBe('number');
      expect(typeof dto.boxB).toBe('number');
      expect(Array.isArray(dto.poles)).toBe(true);
      expect(typeof dto.poles[0].lat).toBe('number');
      expect(typeof dto.poles[0].lng).toBe('number');
    });
  });
});
