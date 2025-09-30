import { Controller, Get } from '@nestjs/common';
import { OzmapService } from './ozmap.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('ozmap')
export class OzmapController {
  constructor(private readonly ozmapService: OzmapService) {}

  @Get('synchronize')
  @ApiOperation({ summary: 'Synchronizes ISP system data with OZmap.' })
  async synchronize() {
    return await this.ozmapService.synchronize();
  }
}
