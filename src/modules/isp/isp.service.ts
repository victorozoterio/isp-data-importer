import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { IspBox, IspCable, IspCustomer, IspDropCable } from './types';

@Injectable()
export class IspService {
  private readonly logger = new Logger(IspService.name);
  constructor(private readonly http: HttpService) {}

  async getAll(): Promise<{
    cables: IspCable;
    drop_cables: IspDropCable;
    boxes: IspBox;
    customers: IspCustomer;
  }> {
    this.logger.log('Starting ISP full data retrieval');
    const startTime = Date.now();

    try {
      const [cables, dropCables, boxes, customers] = await Promise.all([
        this.getCables(),
        this.getDropCables(),
        this.getBoxes(),
        this.getCustomers(),
      ]);

      this.logger.log(
        `ISP data retrieval completed in ${Date.now() - startTime}ms. Summary: ${cables.length} cables, ${dropCables.length} drop cables, ${boxes.length} boxes, ${customers.length} customers`,
      );

      return { cables, drop_cables: dropCables, boxes, customers };
    } catch (error) {
      this.logger.error(
        `ISP data retrieval failed after ${Date.now() - startTime}ms. Error: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getCables(): Promise<IspCable> {
    this.logger.log('Requesting cables from ISP API');
    const startTime = Date.now();

    try {
      const { data } = await firstValueFrom(this.http.get('/cables'));
      this.logger.log(`Cables retrieved: ${data.length} items in ${Date.now() - startTime}ms`);
      return data;
    } catch (error) {
      this.logger.error(`Failed to retrieve cables after ${Date.now() - startTime}ms. Error: ${error.message}`);
      throw error;
    }
  }

  async getDropCables(): Promise<IspDropCable> {
    this.logger.log('Requesting drop cables from ISP API');
    const startTime = Date.now();

    try {
      const { data } = await firstValueFrom(this.http.get('/drop_cables'));
      this.logger.log(`Drop cables retrieved: ${data.length} items in ${Date.now() - startTime}ms`);
      return data;
    } catch (error) {
      this.logger.error(`Failed to retrieve drop cables after ${Date.now() - startTime}ms. Error: ${error.message}`);
      throw error;
    }
  }

  async getBoxes(): Promise<IspBox> {
    this.logger.log('Requesting boxes from ISP API');
    const startTime = Date.now();

    try {
      const { data } = await firstValueFrom(this.http.get('/boxes'));
      this.logger.log(`Boxes retrieved: ${data.length} items in ${Date.now() - startTime}ms`);
      return data;
    } catch (error) {
      this.logger.error(`Failed to retrieve boxes after ${Date.now() - startTime}ms. Error: ${error.message}`);
      throw error;
    }
  }

  async getCustomers(): Promise<IspCustomer> {
    this.logger.log('Requesting customers from ISP API');
    const startTime = Date.now();

    try {
      const { data } = await firstValueFrom(this.http.get('/customers'));
      this.logger.log(`Customers retrieved: ${data.length} items in ${Date.now() - startTime}ms`);
      return data;
    } catch (error) {
      this.logger.error(`Failed to retrieve customers after ${Date.now() - startTime}ms. Error: ${error.message}`);
      throw error;
    }
  }
}
