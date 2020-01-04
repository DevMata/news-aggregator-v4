import { Injectable } from '@nestjs/common';
import { Article } from './entities/articles.entity';
import { SaveArticleDto } from './dto/articles.dto';
import { ArticleRepository } from './repositories/articles.repository';

@Injectable()
export class ArticlesService {
  constructor(private readonly articleRepo: ArticleRepository) {}

  async saveArticle(saveArticleDto: SaveArticleDto): Promise<Article> {
    return this.articleRepo.saveArticle(saveArticleDto);
  }
}
