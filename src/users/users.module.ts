import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { HashHelper } from 'src/common/hash.helper';
import { ArticlesModule } from '../articles/articles.module';
import { UsersToArticlesModule } from '../users_to_articles/users-to-articles.module';
import { UserRepository } from './repositories/user-repository.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository]), ArticlesModule, UsersToArticlesModule],
  providers: [UsersService, HashHelper],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
