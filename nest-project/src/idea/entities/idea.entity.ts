import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IdeaDocument = Idea & Document;

export interface SectionData {
  name: string;
  html: string;
}

@Schema({ timestamps: true })
export class Idea {
  @Prop({ required: true })
  idea: string;

  @Prop({ required: true, type: [{ name: String, html: String }] })
  sections: SectionData[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const IdeaSchema = SchemaFactory.createForClass(Idea);
