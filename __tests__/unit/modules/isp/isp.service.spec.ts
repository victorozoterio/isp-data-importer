import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { IspService } from '../../../../src/modules/isp/isp.service';
import { of, throwError } from 'rxjs';

describe('IspService', () => {
  let service: IspService;
  let httpService: jest.Mocked<HttpService>;

  const mockHttpResponse = <T>(data: T) => ({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as any,
  });

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
    const mockHttpService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IspService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<IspService>(IspService);
    httpService = module.get(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return all ISP data successfully', async () => {
      httpService.get.mockImplementation((url: string) => {
        switch (url) {
          case '/cables':
            return of(mockHttpResponse(mockIspData.cables));
          case '/drop_cables':
            return of(mockHttpResponse(mockIspData.drop_cables));
          case '/boxes':
            return of(mockHttpResponse(mockIspData.boxes));
          case '/customers':
            return of(mockHttpResponse(mockIspData.customers));
          default:
            return throwError(() => new Error('Unknown endpoint'));
        }
      });

      const result = await service.getAll();

      expect(result).toEqual({
        cables: mockIspData.cables,
        drop_cables: mockIspData.drop_cables,
        boxes: mockIspData.boxes,
        customers: mockIspData.customers,
      });
      expect(httpService.get).toHaveBeenCalledTimes(4);
      expect(httpService.get).toHaveBeenCalledWith('/cables');
      expect(httpService.get).toHaveBeenCalledWith('/drop_cables');
      expect(httpService.get).toHaveBeenCalledWith('/boxes');
      expect(httpService.get).toHaveBeenCalledWith('/customers');
    });

    it('should handle partial failures gracefully', async () => {
      httpService.get.mockImplementation((url: string) => {
        switch (url) {
          case '/cables':
            return of(mockHttpResponse(mockIspData.cables));
          case '/drop_cables':
            return throwError(() => new Error('Network error'));
          case '/boxes':
            return of(mockHttpResponse(mockIspData.boxes));
          case '/customers':
            return throwError(() => new Error('Server error'));
          default:
            return throwError(() => new Error('Unknown endpoint'));
        }
      });

      const result = await service.getAll();

      expect(result).toEqual({
        cables: mockIspData.cables,
        drop_cables: [],
        boxes: mockIspData.boxes,
        customers: [],
      });
    });

    it('should handle all requests failing gracefully', async () => {
      httpService.get.mockReturnValue(throwError(() => new Error('All requests failed')));

      const result = await service.getAll();

      expect(result).toEqual({
        cables: [],
        drop_cables: [],
        boxes: [],
        customers: [],
      });
    });
  });

  describe('getCables', () => {
    it('should return cables successfully', async () => {
      httpService.get.mockReturnValue(of(mockHttpResponse(mockIspData.cables)));

      const result = await service.getCables();

      expect(result).toEqual(mockIspData.cables);
      expect(httpService.get).toHaveBeenCalledWith('/cables');
    });

    it('should throw error when request fails', async () => {
      httpService.get.mockReturnValue(throwError(() => new Error('Network error')));

      await expect(service.getCables()).rejects.toThrow('Network error');
    });
  });

  describe('getDropCables', () => {
    it('should return drop cables successfully', async () => {
      httpService.get.mockReturnValue(of(mockHttpResponse(mockIspData.drop_cables)));

      const result = await service.getDropCables();

      expect(result).toEqual(mockIspData.drop_cables);
      expect(httpService.get).toHaveBeenCalledWith('/drop_cables');
    });

    it('should throw error when request fails', async () => {
      httpService.get.mockReturnValue(throwError(() => new Error('Network error')));

      await expect(service.getDropCables()).rejects.toThrow('Network error');
    });
  });

  describe('getBoxes', () => {
    it('should return boxes successfully', async () => {
      httpService.get.mockReturnValue(of(mockHttpResponse(mockIspData.boxes)));

      const result = await service.getBoxes();

      expect(result).toEqual(mockIspData.boxes);
      expect(httpService.get).toHaveBeenCalledWith('/boxes');
    });

    it('should throw error when request fails', async () => {
      httpService.get.mockReturnValue(throwError(() => new Error('Network error')));

      await expect(service.getBoxes()).rejects.toThrow('Network error');
    });
  });

  describe('getCustomers', () => {
    it('should return customers successfully', async () => {
      httpService.get.mockReturnValue(of(mockHttpResponse(mockIspData.customers)));

      const result = await service.getCustomers();

      expect(result).toEqual(mockIspData.customers);
      expect(httpService.get).toHaveBeenCalledWith('/customers');
    });

    it('should throw error when request fails', async () => {
      httpService.get.mockReturnValue(throwError(() => new Error('Network error')));

      await expect(service.getCustomers()).rejects.toThrow('Network error');
    });
  });
});
