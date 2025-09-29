import { Controller, Get } from '@nestjs/common';
import { OzmapService } from './ozmap.service';

@Controller('ozmap')
export class OzmapController {
  constructor(private readonly ozmapService: OzmapService) {}

  @Get('synchronize')
  async synchronize() {
    return await this.ozmapService.synchronize();
  }
}
