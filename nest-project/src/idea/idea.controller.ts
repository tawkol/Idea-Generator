import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { IdeaService } from './idea.service';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { UpdateIdeaDto } from './dto/update-idea.dto';

@Controller('ideas')
export class IdeaController {
  constructor(private readonly ideaService: IdeaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) createIdeaDto: CreateIdeaDto) {
    try {
      return await this.ideaService.create(createIdeaDto);
    } catch (error) {
      console.error('Error creating idea:', error);
      throw new BadRequestException('Failed to create idea');
    }
  }

  @Get()
  async findAll() {
    return this.ideaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ideaService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateIdeaDto: UpdateIdeaDto,
  ) {
    console.log(`Updating idea with ID: ${id}`);
    return this.ideaService.update(id, updateIdeaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.ideaService.remove(id);
  }
}
