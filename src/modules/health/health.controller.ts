import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController, ApiOperation } from '@nestjs/swagger';

@Controller('health')
@ApiExcludeController()
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Retrieves information about server health.' })
  check() {
    return { status: 'ok' };
  }
}
