import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BoxDocument = Box & Document;

@Schema({ collection: 'boxes', timestamps: true })
export class Box {
  @Prop({ required: true, unique: true })
  ispId: number;

  @Prop()
  name?: string;

  @Prop()
  boxType?: string;

  @Prop({ type: [Number] })
  coords?: number[];

  @Prop({ required: true })
  createdAt: string;

  @Prop({ required: true })
  updatedAt: string;
}

export const BoxSchema = SchemaFactory.createForClass(Box);
