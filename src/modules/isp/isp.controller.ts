import { Controller, Get } from '@nestjs/common';
import { IspService } from './isp.service';

@Controller('isp')
export class IspController {
  constructor(private readonly ispService: IspService) {}

  @Get('all')
  async getAll() {
    return await this.ispService.getAll();
  }
}
