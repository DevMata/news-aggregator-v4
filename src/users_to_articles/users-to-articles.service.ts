import { Injectable, ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UsersToArticles } from './entities/users-to-articles.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Article } from '../articles/entities/articles.entity';

@Injectable()
export class UsersToArticlesService {
  constructor(
    @InjectRepository(UsersToArticles) private readonly usersToArticlesRepository: Repository<UsersToArticles>,
  ) {}

  searchArticleFromUser(user: User, article: Article): Promise<UsersToArticles> {
    return this.usersToArticlesRepository.findOne({ user: user, article: article });
  }

  async saveArticleToUser(user: User, article: Article): Promise<UsersToArticles> {
    const relation = await this.searchArticleFromUser(user, article);
    if (relation) throw new ConflictException('User already save this article');

    return this.usersToArticlesRepository.save({ user, article });
  }
}
