import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { GenerateImageDto } from './dto/generate-image.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { AdminGuard } from '../auth/guard/admin.guard';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate-image')
  generateImage(@Body() generateImageDto: GenerateImageDto) {
    return this.aiService.generateImage(generateImageDto);
  }
}
