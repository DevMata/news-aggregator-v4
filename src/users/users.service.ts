import { Injectable, MethodNotAllowedException, UnauthorizedException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/user.dto';
import { HashHelper } from 'src/common/hash.helper';
import { ArticlesService } from '../articles/articles.service';
import { UsersToArticlesService } from '../users_to_articles/users-to-articles.service';
import { SaveArticleDto } from '../articles/dto/articles.dto';
import { Article } from '../articles/entities/articles.entity';
import { UsersToArticles } from '../users_to_articles/entities/users-to-articles.entity';
import { ShareArticleDto } from './dto/shareArticle.dto';
import { UserBody } from 'src/authentication/dto/userbody.dto';
import { UserRepository } from './repositories/user-repository.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly usersToArticlesService: UsersToArticlesService,
    private readonly hashHelper: HashHelper,
    private readonly userRepository: UserRepository,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.getUsers();
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.createUser(createUserDto);
  }

  findUserById(userId: string): Promise<User> {
    return this.userRepository.findUserById(userId);
  }

  findUserByName(username: string): Promise<User> {
    return this.userRepository.findUserByName(username);
  }

  async changePassword(userId: string, password: string, userBodyDto: UserBody): Promise<UpdateResult> {
    if (userId !== userBodyDto.userId) throw new UnauthorizedException('Password can not be change by another user');

    return this.userRepository.changeUserPassword(userId, this.hashHelper.hash(password));
  }

  async saveArticleToUser(userId: string, saveArticleDto: SaveArticleDto): Promise<UsersToArticles> {
    const user = await this.userRepository.findUserById(userId);

    const article = await this.articlesService.saveArticle(saveArticleDto);

    return this.usersToArticlesService.saveArticleToUser(user, article);
  }

  async getUserArticles(userId: string): Promise<Article[]> {
    return this.userRepository.getUserArticles(userId);
  }

  async shareArticle(userId: string, shareArticleDto: ShareArticleDto): Promise<UsersToArticles> {
    if (userId === shareArticleDto.userId) {
      throw new MethodNotAllowedException('User must no share articles with himself');
    }

    return this.saveArticleToUser(shareArticleDto.userId, { webUrl: shareArticleDto.webUrl });
  }
}
