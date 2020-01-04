import { EntityRepository, Repository } from 'typeorm';
import { Article } from '../entities/articles.entity';
import { SaveArticleDto } from '../dto/articles.dto';

@EntityRepository(Article)
export class ArticleRepository extends Repository<Article> {
  private findArticle(saveArticleDto: SaveArticleDto): Promise<Article> {
    return this.findOne({ webUrl: saveArticleDto.webUrl });
  }

  async saveArticle(saveArticleDto: SaveArticleDto): Promise<Article> {
    const article = await this.findArticle(saveArticleDto);

    if (article) {
      return article;
    }

    return this.save(saveArticleDto);
  }
}
