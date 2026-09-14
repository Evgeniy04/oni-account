import { Module } from '@nestjs/common';
import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity.js';
import { DatabaseModule } from '../database/database.module.js';
import { UserRepository } from './user.repository.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    DatabaseModule,
  ],
  providers: [
    UserService,
    UserRepository,
  ],
  controllers: [
    UserController,
  ],
})
export class UserModule {}