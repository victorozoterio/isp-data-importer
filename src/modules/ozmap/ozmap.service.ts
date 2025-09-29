import { Inject, Injectable } from '@nestjs/common';
import { CreateBoxDto } from './dto/create-box.dto';
import { CreateCableDto } from './dto/create-cable.dto';
import { IspService } from '../isp/isp.service';
import { OzmapRepository } from './ozmap.repository';

export interface OzmapSdk {
  box: { create(dto: CreateBoxDto) };
  cable: { create(dto: CreateCableDto) };
}

export const OZMAP_SDK = 'OZMAP_SDK';

@Injectable()
export class OzmapService {
  constructor(
    @Inject(OZMAP_SDK) private readonly sdk: OzmapSdk,
    private readonly ispService: IspService,
    private readonly ozmapRepository: OzmapRepository,
  ) {}

  async synchronize() {
    const ispInformations = await this.ispService.getAll();

    const boxes = ispInformations.boxes.map((box) => {
      return {
        id: box.id,
        name: box.name,
        boxType: box.type,
        coords: [box.lng, box.lat],
      };
    });

    const createdBoxes = await this.createBoxes(boxes);

    const boxIdMapping = new Map<number, string>();
    for (const box of createdBoxes) {
      if (box.ispId) boxIdMapping.set(box.ispId, box._id.toString());
    }

    const cables = ispInformations.cables.map((cable) => {
      return {
        id: cable.id,
        name: cable.name,
        cableType: String(cable.capacity),
        boxA: cable.boxes_connected[0],
        boxB: cable.boxes_connected[1],
        poles: cable.path,
      };
    });

    const createdCables = await this.createCables(cables, boxIdMapping);
    return { boxes, cables: createdCables };
  }

  async createBoxes(dtos: CreateBoxDto[]) {
    const results = [];

    for (const dto of dtos) {
      const existingBox = await this.ozmapRepository.findBoxByIspId(dto.id);
      if (existingBox) {
        results.push(existingBox);
        continue;
      }

      const ozmapResponse = await this.sdk.box.create(dto);
      const savedBox = await this.ozmapRepository.saveBox(ozmapResponse);
      results.push(savedBox);
    }

    return results;
  }

  async createCables(dtos: CreateCableDto[], boxIdMapping?: Map<number, string>) {
    const results = [];

    for (const dto of dtos) {
      const existingCable = await this.ozmapRepository.findCableByIspId(dto.id);
      if (existingCable) {
        results.push(existingCable);
        continue;
      }

      const boxAResponseId = dto.boxA && boxIdMapping ? boxIdMapping.get(dto.boxA) : undefined;
      const boxBResponseId = dto.boxB && boxIdMapping ? boxIdMapping.get(dto.boxB) : undefined;

      const ozmapResponse = await this.sdk.cable.create(dto);
      const savedCable = await this.ozmapRepository.saveCable(ozmapResponse, boxAResponseId, boxBResponseId);
      results.push(savedCable);
    }

    return results;
  }
}
