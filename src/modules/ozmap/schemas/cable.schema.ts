import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CableDocument = Cable & Document;

@Schema({ collection: 'cables', timestamps: true })
export class Cable {
  @Prop({ required: true, unique: true })
  ispId: number;

  @Prop()
  name?: string;

  @Prop()
  cableType?: string;

  @Prop({ type: Types.ObjectId, ref: 'BoxResponse' })
  boxA?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'BoxResponse' })
  boxB?: Types.ObjectId;

  @Prop({ type: [{ lat: Number, lng: Number }] })
  poles: { lat: number; lng: number }[];

  @Prop({ required: true })
  createdAt: string;

  @Prop({ required: true })
  updatedAt: string;
}

export const CableSchema = SchemaFactory.createForClass(Cable);
