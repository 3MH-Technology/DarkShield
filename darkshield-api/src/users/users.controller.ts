import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { OwnerGuard } from '../auth/guard/owner.guard';
import { Request } from 'express';

@UseGuards(JwtAuthGuard, OwnerGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Req() req: Request) {
    const user = req.user as { id: number };
    return this.usersService.findAll(user.id);
  }

  @Put(':id/promote')
  promote(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.promote(id);
  }

  @Put(':id/demote')
  demote(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.demote(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.delete(id);
  }
}
