import { EntityRepository, Repository, UpdateResult } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/user.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Article } from 'src/articles/entities/articles.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  getUsers(): Promise<User[]> {
    return this.find({ select: ['userId', 'username', 'createdAt', 'modifiedAt'] });
  }

  async findUserById(userId: string): Promise<User> {
    const user = await this.findOne(userId, { select: ['userId', 'username', 'createdAt', 'modifiedAt'] });

    if (!user) throw new NotFoundException('User does not exist');

    return user;
  }

  findUserByName(username: string): Promise<User> {
    return this.findOne({ username: username });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const res = await this.findUserByName(createUserDto.username);
    if (res) throw new ConflictException('User already exists');

    return this.save(createUserDto);
  }

  async changeUserPassword(userId: string, password: string): Promise<UpdateResult> {
    await this.findUserById(userId);

    return this.update(userId, { password: password });
  }

  async getUserArticles(userId: string): Promise<Article[]> {
    await this.findUserById(userId);

    const x = await this.findOne({
      join: {
        alias: 'user',
        leftJoinAndSelect: {
          usersToArticles: 'user.usersToArticles',
          article: 'usersToArticles.article',
        },
      },
      where: { userId: userId },
    });

    if (x && x.usersToArticles) {
      return x.usersToArticles.map(rel => rel.article);
    }
  }
}
