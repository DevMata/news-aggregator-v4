import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class NewsParamsDto {
  @IsString()
  @IsNotEmpty()
  q: string;

  @IsNotEmpty()
  @IsIn(['nyt', 'guardian', 'news', 'all'])
  source: string;
}
