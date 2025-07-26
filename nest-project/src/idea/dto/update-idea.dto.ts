import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

class SectionDto {
  @IsString()
  @IsNotEmpty({ message: 'Section name cannot be empty' })
  @MinLength(1, { message: 'Section name must be at least 1 character long' })
  @MaxLength(100, { message: 'Section name cannot exceed 100 characters' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Section HTML cannot be empty' })
  html: string;

  @IsString()
  @IsNotEmpty({ message: 'Section ID cannot be empty' })
  _id: string;
}

export class UpdateIdeaDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: 'Website idea cannot be empty' })
  @MinLength(5, { message: 'Website idea must be at least 5 characters long' })
  @MaxLength(500, { message: 'Website idea cannot exceed 500 characters' })
  idea?: string;

  @IsArray({ message: 'Sections must be an array' })
  @ValidateNested({ each: true })
  @Type(() => SectionDto)
  sections!: SectionDto[];
}
