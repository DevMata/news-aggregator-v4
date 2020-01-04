import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersToArticles } from './entities/users-to-articles.entity';
import { UsersToArticlesService } from './users-to-articles.service';

@Module({
  imports: [TypeOrmModule.forFeature([UsersToArticles])],
  providers: [UsersToArticlesService],
  exports: [UsersToArticlesService],
})
export class UsersToArticlesModule {}
