import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthenticationService } from '../authentication.service';
import { UserBody } from '../dto/userbody.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly loginService: AuthenticationService) {
    super();
  }

  async validate(username: string, password: string): Promise<UserBody> {
    const user = this.loginService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Wrong credentials');
    }
    return user;
  }
}
