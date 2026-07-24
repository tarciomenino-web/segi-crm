import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '@/modules/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET || 'secret',
    });
  }

  async validate(payload: { sub: string; organizationId: string }) {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      return null;
    }

    return {
      userId: payload.sub,
      organizationId: payload.organizationId,
      user,
    };
  }
}
