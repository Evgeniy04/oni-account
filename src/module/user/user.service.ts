import * as crypto from 'node:crypto';
import * as argon from 'argon2';
import {
  Injectable,
  ConflictException,
  NotFoundException,
  Inject,
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserRepository } from './user.repository.js';
import { UserDto } from './dto/user.dto.js';
import GetUserFilterDto from './dto/get-users-filter.dto.js';
import { SignInDto } from './dto/sign-in.dto.js';

import { REDIS_TOKEN } from '../../config/redis/redis.constant.js';
import { Redis } from 'ioredis';

@Injectable()
export class UserService {
  constructor(
    @Inject(REDIS_TOKEN)
    private readonly redis: Redis,
    private readonly userRepository: UserRepository
  ) {}

  async create(user: CreateUserDto): Promise<UserDto> {
    const userExist = await this.userRepository.checkExistUser({
      phone: user.phone,
      login: user.login,
    });

    if (userExist) {
      throw new ConflictException('User already exist');
    }

    const salt = crypto.randomBytes(32);

    const hash = await argon.hash(user.password, {
      salt,
    });

    const createdUser = await this.userRepository.createUser({
      passwordHash: hash,
      passwordSalt: salt.toString('hex'),
      ...user,
    });

    return new UserDto(createdUser);
  }

  async verification({ login, password }: SignInDto): Promise<boolean> {
    const user = await this.userRepository.findByLogin(login);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return argon.verify(user.passwordHash, password);
  }

  async findAll(getUserFilterDto: GetUserFilterDto): Promise<{
    items: UserDto[];
    total: number;
  }> {
    const { items: users, total } =
      await this.userRepository.findAndCount(getUserFilterDto);
    const dtos = users.map((user) => new UserDto(user));
    return { items: dtos, total };
  }

  findOne(id: string) {
    return this.userRepository.findById(id);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.updateUser({ userId: id, ...updateUserDto });
  }

  async remove(id: string) {
    const user =
      await this.userRepository.findById(id);
    if (user) await this.redis.del(user.login);
    return this.userRepository.deleteUser(id);
  }
}
