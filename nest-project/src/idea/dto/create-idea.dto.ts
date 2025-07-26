import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateIdeaDto {
  @IsString()
  @IsNotEmpty({ message: 'Website idea cannot be empty' })
  @MinLength(5, { message: 'Website idea must be at least 5 characters long' })
  @MaxLength(500, { message: 'Website idea cannot exceed 500 characters' })
  idea: string;
}
