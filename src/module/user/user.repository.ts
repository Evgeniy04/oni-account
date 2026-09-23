import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity.js';
import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';

import {
  CheckExistUserParams,
  FindUserParams,
  ChangeBalanceParams,
} from './user.types.js';

export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser<T extends DeepPartial<UserEntity>>(
    entity: T,
  ): Promise<UserEntity> {
    return this.userRepository.save(entity);
  }

  async findById(userId: string): Promise<UserEntity | null> {
    return this.userRepository.findOneBy({
      userId,
    });
  }

  async findByLogin(login: string): Promise<UserEntity | null> {
    return this.userRepository.findOneBy({
      login,
      isDeleted: false,
    });
  }

  async findAndCount(params: FindUserParams): Promise<{
    items: UserEntity[];
    total: number;
  }> {
    const [items, total] = await this.qb(params).getManyAndCount();

    return {
      items,
      total,
    };
  }

  async updateUser(params: DeepPartial<UserEntity>): Promise<void> {
    const { balance, ...updateUser } = params;

    await this.userRepository.update(
      {
        userId: params.userId,
      },
      updateUser,
    );
  }

  async changeBalance(params: ChangeBalanceParams): Promise<void> {
    const { userId, balance } = params;

    await this.userRepository.update({ userId }, { balance });
  }

  async deleteUser(userId: string): Promise<void> {
    await this.userRepository.update(
      { userId },
      {
        isDeleted: true,
      },
    );
  }

  async checkExistUser(
    params: CheckExistUserParams,
    alias = 'user',
  ): Promise<boolean> {
    const query = this.userRepository.createQueryBuilder(alias);

    query.where(`${alias}.login = :login`, {
      login: params.login,
    });

    query.orWhere(`${alias}.phone = :phone`, {
      phone: params.phone,
    });

    query.andWhere(`${alias}.isDeleted = :isDeleted`, {
      isDeleted: false,
    });

    const result = await query.getOne();
    return !!result;
  }

  qb(
    params: FindUserParams = {},
    alias = 'user',
  ): SelectQueryBuilder<UserEntity> {
    const query = this.userRepository.createQueryBuilder(alias);

    query.andWhere(`${alias}.isDeleted = :isDeleted`, {
      isDeleted: false,
    });

    if (params.userIds?.length) {
      query.andWhere(`${alias}.userId IN (:...userIds)`, {
        userIds: Array.isArray(params.userIds)
          ? params.userIds
          : [params.userIds],
      });
    }

    if (params.phones?.length) {
      query.andWhere(`${alias}.phone IN (:...phones)`, {
        phones: Array.isArray(params.phones) ? params.phones : [params.phones],
      });
    }

    if (params.logins?.length) {
      query.andWhere(`${alias}.login IN (:...logins)`, {
        logins: Array.isArray(params.logins) ? params.logins : [params.logins],
      });
    }

    if (params.take) {
      query.take(params.take);
    }

    if (params.skip) {
      query.skip(params.skip);
    }

    return query;
  }
}
