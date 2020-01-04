import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import { UserBody } from 'src/authentication/dto/userbody.dto';

export const LoggedUser = createParamDecorator(
  (data: unknown, req: Request): UserBody => {
    return req.user as UserBody;
  },
);
