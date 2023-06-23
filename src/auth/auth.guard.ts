import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractJwtFromCookie(request);
    if (!token) {
      throw new UnauthorizedException('Необходима авторизация.');
    }
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.config.get<string>('JWT_SECRET'),
      });
      request['user'] = payload.id;
    } catch (err) {
      throw new UnauthorizedException('Необходима авторизация.');
    }
    return true;
  }

  private extractJwtFromCookie(req: Request): string | null {
    if (req.cookies && 'jwt' in req.cookies) {
      return req.cookies.jwt;
    }

    return null;
  }
}
