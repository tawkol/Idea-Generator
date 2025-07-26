import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IdeaService } from './idea.service';
import { IdeaController } from './idea.controller';
import { Idea, IdeaSchema } from './entities/idea.entity';
import { GeminiModule } from '../gemini/gemini.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Idea.name, schema: IdeaSchema }]),
    GeminiModule,
  ],
  controllers: [IdeaController],
  providers: [IdeaService],
})
export class IdeaModule {}
