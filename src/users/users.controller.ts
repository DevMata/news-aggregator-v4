import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/user.dto';
import { ChangePasswordDto } from './dto/password.dto';
import { UpdateResult } from 'typeorm';
import { SaveArticleDto } from '../articles/dto/articles.dto';
import { Article } from '../articles/entities/articles.entity';
import { UsersToArticles } from '../users_to_articles/entities/users-to-articles.entity';
import { UserSerialize } from './dto/users.serializer';
import { AuthGuard } from '@nestjs/passport';
import { ShareArticleDto } from './dto/shareArticle.dto';
import { UserIdDto } from './dto/user-id.dto';
import { LoggedUser } from './user.decorator';
import { UserBody } from 'src/authentication/dto/userbody.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  getUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':userId')
  findUser(@Param() userIdParam: UserIdDto): Promise<User> {
    return this.userService.findUserById(userIdParam.userId);
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  async createUser(
    @Body()
    createUserDto: CreateUserDto,
  ): Promise<UserSerialize> {
    return new UserSerialize(await this.userService.createUser(createUserDto));
  }

  @Put(':userId/changePassword')
  @UseGuards(AuthGuard('jwt'))
  changePassword(
    @Param() userIdParam: UserIdDto,
    @Body() changePasswordDto: ChangePasswordDto,
    @LoggedUser() User: UserBody,
  ): Promise<UpdateResult> {
    return this.userService.changePassword(userIdParam.userId, changePasswordDto.password, User);
  }

  @Post(':userId/articles')
  @UseGuards(AuthGuard('jwt'))
  saveArticleToUser(@Param() userIdParam: UserIdDto, @Body() saveArticleDto: SaveArticleDto): Promise<UsersToArticles> {
    return this.userService.saveArticleToUser(userIdParam.userId, saveArticleDto);
  }

  @Get(':userId/articles')
  @UseGuards(AuthGuard('jwt'))
  getUserArticles(@Param() userIdParam: UserIdDto): Promise<Article[]> {
    return this.userService.getUserArticles(userIdParam.userId);
  }

  @Post(':userId/share')
  @UseGuards(AuthGuard('jwt'))
  shareArticle(@Param() userIdParam: UserIdDto, @Body() shareArticleDto: ShareArticleDto): Promise<UsersToArticles> {
    return this.userService.shareArticle(userIdParam.userId, shareArticleDto);
  }
}
