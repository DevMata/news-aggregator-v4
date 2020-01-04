import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ValidateJsonMiddleware } from './common/middleware/validate-json.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NewsModule } from './news/news.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthenticationModule } from './authentication/authentication.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    NewsModule,
    UsersModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres' as 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          database: configService.get('DB_NAME'),
          username: configService.get('DB_USER'),
          password: configService.get('DB_PASS'),
          entities: ['dist/**/*.entity{.ts,.js}'],
          synchronize: true,
        } as TypeOrmModuleOptions;
      },
      inject: [ConfigService],
    }),
    AuthenticationModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(ValidateJsonMiddleware).forRoutes('login', 'users');
  }
}
