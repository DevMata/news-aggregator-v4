import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UsersToArticles } from '../../users_to_articles/entities/users-to-articles.entity';

@Entity()
export class Article {
  @PrimaryGeneratedColumn('uuid')
  articleId: string;

  @Column()
  webUrl: string;

  @OneToMany(
    () => UsersToArticles,
    usersToArticles => usersToArticles.article,
  )
  public usersToArticles!: UsersToArticles[];
}
