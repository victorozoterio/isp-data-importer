import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { IspBox, IspCable, IspCustomer, IspDropCable } from './types';

@Injectable()
export class IspService {
  constructor(private readonly http: HttpService) {}

  async getAll(): Promise<{
    cables: IspCable;
    drop_cables: IspDropCable;
    boxes: IspBox;
    customers: IspCustomer;
  }> {
    const [cables, dropCables, boxes, customers] = await Promise.all([
      this.getCables(),
      this.getDropCables(),
      this.getBoxes(),
      this.getCustomers(),
    ]);
    return { cables, drop_cables: dropCables, boxes, customers };
  }

  async getCables(): Promise<IspCable> {
    const { data } = await firstValueFrom(this.http.get('/cables'));
    return data;
  }

  async getDropCables(): Promise<IspDropCable> {
    const { data } = await firstValueFrom(this.http.get('/drop_cables'));
    return data;
  }

  async getBoxes(): Promise<IspBox> {
    const { data } = await firstValueFrom(this.http.get('/boxes'));
    return data;
  }

  async getCustomers(): Promise<IspCustomer> {
    const { data } = await firstValueFrom(this.http.get('/customers'));
    return data;
  }
}
