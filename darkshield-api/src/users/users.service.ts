import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(ownerId: number) {
    return this.prisma.user.findMany({
      where: {
        id: {
          not: ownerId,
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async promote(id: number) {
    const userToPromote = await this.findUserById(id);
    if (userToPromote.role === UserRole.OWNER) {
      throw new ForbiddenException('Cannot change the role of an owner.');
    }
    return this.updateUserRole(id, UserRole.ADMIN);
  }

  async demote(id: number) {
    const userToDemote = await this.findUserById(id);
    if (userToDemote.role === UserRole.OWNER) {
      throw new ForbiddenException('Cannot change the role of an owner.');
    }
    return this.updateUserRole(id, UserRole.USER);
  }

  async delete(id: number) {
    const userToDelete = await this.findUserById(id);
    if (userToDelete.role === UserRole.OWNER) {
      throw new ForbiddenException('Owner account cannot be deleted.');
    }
    await this.prisma.user.delete({ where: { id } });
  }

  private async findUserById(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return user;
  }

  private async updateUserRole(id: number, role: UserRole) {
    return this.prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
  }
}
