import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateBoxDto } from './dto/create-box.dto';
import { CreateCableDto } from './dto/create-cable.dto';
import { IspService } from '../isp/isp.service';
import { OzmapRepository } from './ozmap.repository';
import { Cron, CronExpression } from '@nestjs/schedule';

export interface OzmapSdk {
  box: { create(dto: CreateBoxDto) };
  cable: { create(dto: CreateCableDto) };
}

export const OZMAP_SDK = 'OZMAP_SDK';

@Injectable()
export class OzmapService {
  private readonly logger = new Logger(OzmapService.name);

  constructor(
    @Inject(OZMAP_SDK) private readonly sdk: OzmapSdk,
    private readonly ispService: IspService,
    private readonly ozmapRepository: OzmapRepository,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async synchronize() {
    this.logger.log('Starting OZmap synchronization');
    const startTime = Date.now();

    try {
      this.logger.log('Getting ISP data');
      const ispInformations = await this.ispService.getAll();
      this.logger.log(`ISP data got. Boxes: ${ispInformations.boxes.length}, Cables: ${ispInformations.cables.length}`);

      this.logger.log('Transforming ISP boxes to OZmap format');
      const boxes = ispInformations.boxes.map((box) => ({
        id: box.id,
        name: box.name,
        boxType: box.type,
        coords: [box.lng, box.lat],
      }));
      this.logger.log(`Transformed ${boxes.length} boxes`);

      const createdBoxes = await this.createBoxes(boxes);

      this.logger.log('Building box ID mapping');
      const boxIdMapping = new Map<number, string>();
      for (const box of createdBoxes.results) {
        if (box.ispId) {
          boxIdMapping.set(box.ispId, box._id.toString());
          this.logger.debug(`Box mapping created. ISP ID: ${box.ispId}, OZmap ID: ${box._id}`);
        }
      }
      this.logger.log(`Box ID mapping completed. ${boxIdMapping.size} mappings created`);

      this.logger.log('Transforming ISP cables to OZmap format');
      const cables = ispInformations.cables.map((cable) => ({
        id: cable.id,
        name: cable.name,
        cableType: String(cable.capacity),
        boxA: cable.boxes_connected[0],
        boxB: cable.boxes_connected[1],
        poles: cable.path,
      }));
      this.logger.log(`Transformed ${cables.length} cables`);

      const createdCables = await this.createCables(cables, boxIdMapping);

      this.logger.log(
        `OZmap synchronization completed in ${Date.now() - startTime}ms. Summary: Boxes created ${createdBoxes.createdCount}, skipped ${createdBoxes.skippedCount}; Cables created ${createdCables.createdCount}, skipped ${createdCables.skippedCount}`,
      );

      return { boxes: createdBoxes.results, cables: createdCables.results };
    } catch (error) {
      this.logger.error(
        `OZmap synchronization failed after ${Date.now() - startTime}ms. Error: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async createBoxes(dtos: CreateBoxDto[]) {
    this.logger.log(`Starting box creation. Total: ${dtos.length}`);
    const startTime = Date.now();
    const results = [];
    let createdCount = 0;
    let skippedCount = 0;

    for (const dto of dtos) {
      this.logger.debug(`Processing box. Name: ${dto.name}, ISP ID: ${dto.id}`);

      const existingBox = await this.ozmapRepository.findBoxByIspId(dto.id);
      if (existingBox) {
        skippedCount++;
        this.logger.debug(`Box already exists. Name: ${dto.name}, ISP ID: ${dto.id}, OZmap ID: ${existingBox._id}`);
        results.push(existingBox);
        continue;
      }

      this.logger.debug(`Creating new box. Name: ${dto.name}, ISP ID: ${dto.id}`);
      const ozmapResponse = await this.sdk.box.create(dto);
      const savedBox = await this.ozmapRepository.saveBox(ozmapResponse);
      createdCount++;
      this.logger.debug(`Box created successfully. Name: ${dto.name}, ISP ID: ${dto.id}, OZmap ID: ${savedBox._id}`);
      results.push(savedBox);
    }

    this.logger.log(
      `Box creation completed in ${Date.now() - startTime}ms. Created: ${createdCount}, Skipped: ${skippedCount}, Total processed: ${results.length}`,
    );

    return { results, createdCount, skippedCount };
  }

  async createCables(dtos: CreateCableDto[], boxIdMapping?: Map<number, string>) {
    this.logger.log(`Starting cable creation. Total: ${dtos.length}`);
    const startTime = Date.now();
    const results = [];
    let createdCount = 0;
    let skippedCount = 0;

    for (const dto of dtos) {
      this.logger.debug(`Processing cable. Name: ${dto.name}, ISP ID: ${dto.id}`);

      const existingCable = await this.ozmapRepository.findCableByIspId(dto.id);
      if (existingCable) {
        skippedCount++;
        this.logger.debug(`Cable already exists. Name: ${dto.name}, ISP ID: ${dto.id}, OZmap ID: ${existingCable._id}`);
        results.push(existingCable);
        continue;
      }

      const boxAResponseId = dto.boxA && boxIdMapping ? boxIdMapping.get(dto.boxA) : undefined;
      const boxBResponseId = dto.boxB && boxIdMapping ? boxIdMapping.get(dto.boxB) : undefined;

      this.logger.debug(`Creating new cable. Name: ${dto.name}, ISP ID: ${dto.id}`);
      const ozmapResponse = await this.sdk.cable.create(dto);
      const savedCable = await this.ozmapRepository.saveCable(ozmapResponse, boxAResponseId, boxBResponseId);
      createdCount++;
      this.logger.debug(
        `Cable created successfully. Name: ${dto.name}, ISP ID: ${dto.id}, OZmap ID: ${savedCable._id}`,
      );
      results.push(savedCable);
    }

    this.logger.log(
      `Cable creation completed in ${Date.now() - startTime}ms. Created: ${createdCount}, Skipped: ${skippedCount}, Total processed: ${results.length}`,
    );

    return { results, createdCount, skippedCount };
  }
}
