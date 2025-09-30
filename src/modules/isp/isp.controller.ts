import { Controller, Get } from '@nestjs/common';
import { IspService } from './isp.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('isp')
export class IspController {
  constructor(private readonly ispService: IspService) {}

  @Get('all')
  @ApiOperation({ summary: 'Retrieves information about ISP system.' })
  async getAll() {
    return await this.ispService.getAll();
  }
}
