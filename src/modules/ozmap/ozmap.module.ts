import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OZMAP_SDK, OzmapService } from './ozmap.service';
import { OzmapRepository } from './ozmap.repository';
import { OzMapSDKMock } from './ozmap-sdk.mock';
import { Box, BoxSchema } from './schemas/box.schema';
import { Cable, CableSchema } from './schemas/cable.schema';
import { IspModule } from '../isp/isp.module';
import { OzmapController } from './ozmap.controller';

@Module({
  controllers: [OzmapController],
  imports: [
    IspModule,
    MongooseModule.forFeature([
      { name: Box.name, schema: BoxSchema },
      { name: Cable.name, schema: CableSchema },
    ]),
  ],
  providers: [OzmapService, OzmapRepository, { provide: OZMAP_SDK, useFactory: () => new OzMapSDKMock() }],
  exports: [OzmapService, OzmapRepository],
})
export class OzmapModule {}
