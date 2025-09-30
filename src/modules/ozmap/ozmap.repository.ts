import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Box, BoxDocument } from './schemas/box.schema';
import { Cable, CableDocument } from './schemas/cable.schema';
import { Box as BoxType, Cable as CableType } from './types';

@Injectable()
export class OzmapRepository {
  private readonly logger = new Logger(OzmapRepository.name);

  constructor(
    @InjectModel(Box.name) private boxModel: Model<BoxDocument>,
    @InjectModel(Cable.name) private cableModel: Model<CableDocument>,
  ) {}

  async saveBox(box: BoxType): Promise<BoxDocument> {
    try {
      const boxResponse = new this.boxModel({
        ispId: box.id,
        name: box.name,
        boxType: box.boxType,
        coords: box.coords,
        createdAt: box.createdAt,
        updatedAt: box.updatedAt,
      });

      const saved = await boxResponse.save();
      this.logger.log(`Box persisted to database. ISP ID: ${box.id}, OZmap ID: ${saved._id}`);
      return saved;
    } catch (error) {
      this.logger.error(`Failed to persist box. ISP ID: ${box.id}. Error: ${error.message}`);
      throw error;
    }
  }

  async saveCable(cable: CableType, boxAResponseId?: string, boxBResponseId?: string): Promise<CableDocument> {
    try {
      const cableResponse = new this.cableModel({
        ispId: cable.id,
        name: cable.name,
        cableType: cable.cableType,
        boxA: boxAResponseId ? boxAResponseId : undefined,
        boxB: boxBResponseId ? boxBResponseId : undefined,
        poles: cable.poles,
        createdAt: cable.createdAt,
        updatedAt: cable.updatedAt,
      });

      const saved = await cableResponse.save();
      this.logger.log(`Cable persisted to database. ISP ID: ${cable.id}, OZmap ID: ${saved._id}`);
      return saved;
    } catch (error) {
      this.logger.error(`Failed to persist cable. ISP ID: ${cable.id}. Error: ${error.message}`);
      throw error;
    }
  }

  async findBoxByIspId(ispId: number): Promise<BoxDocument | null> {
    return this.boxModel.findOne({ ispId }).exec();
  }

  async findCableByIspId(ispId: number): Promise<CableDocument | null> {
    return this.cableModel.findOne({ ispId }).exec();
  }

  async getAllBoxes(): Promise<BoxDocument[]> {
    return this.boxModel.find().exec();
  }

  async getAllCables(): Promise<CableDocument[]> {
    return this.cableModel.find().populate('boxA boxB').exec();
  }
}
