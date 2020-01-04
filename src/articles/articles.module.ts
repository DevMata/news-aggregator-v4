import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesService } from './articles.service';
import { ArticleRepository } from './repositories/articles.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleRepository])],
  providers: [ArticlesService],
  exports: [ArticlesService],
})
export class ArticlesModule {}
