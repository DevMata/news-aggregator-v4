import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { NewsService } from './news.service';
import { Observable } from 'rxjs';
import { New } from './interfaces/New.interface';
import { AuthGuard } from '@nestjs/passport';
import { NewsParamsDto } from './dto/news-params.dto';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Query() newsParamsDto: NewsParamsDto): Observable<New[]> {
    return this.newsService.switchSourceSearch(newsParamsDto.q, newsParamsDto.source);
  }
}
