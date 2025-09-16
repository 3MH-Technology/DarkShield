import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class GenerateImageDto {
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @IsString()
  @IsIn(['16:9', '4:3'])
  aspectRatio: '16:9' | '4:3';
}
