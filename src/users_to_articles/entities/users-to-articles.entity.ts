import { Entity, CreateDateColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Article } from '../../articles/entities/articles.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class UsersToArticles {
  @PrimaryGeneratedColumn('uuid')
  usersToArticlesId: string;

  @CreateDateColumn()
  savedAt: Date;

  @ManyToOne(
    () => User,
    user => user.usersToArticles,
  )
  public user!: User;

  @ManyToOne(
    () => Article,
    article => article.usersToArticles,
  )
  public article!: Article;
}
