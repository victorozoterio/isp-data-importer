import { OzmapSdk } from '../ozmap/ozmap.service';
import { CreateBoxDto } from '../ozmap/dto/create-box.dto';
import { CreateCableDto } from '../ozmap/dto/create-cable.dto';
import { Box, Cable } from './types';

export class OzMapSDKMock implements OzmapSdk {
  private boxes = new Map<string, Box>();
  private cables = new Map<string, Cable>();

  box = {
    create: async (dto: CreateBoxDto): Promise<Box> => {
      const box: Box = {
        id: dto.id,
        name: dto.name,
        boxType: dto.boxType,
        coords: dto.coords,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.boxes.set(String(dto.id), box);
      return box;
    },
  };

  cable = {
    create: async (dto: CreateCableDto): Promise<Cable> => {
      const cable: Cable = {
        id: dto.id,
        name: dto.name,
        cableType: dto.cableType,
        boxA: dto.boxA ? String(dto.boxA) : null,
        boxB: dto.boxB ? String(dto.boxB) : null,
        poles: dto.poles,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.cables.set(String(dto.id), cable);
      return cable;
    },
  };
}
