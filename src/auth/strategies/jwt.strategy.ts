import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import configuration from '../../config/configuration';
import { JwtContent } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
  constructor() {
    super({
      jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration:false,
      secretOrKey: configuration.jwt.secret
    });
  }
  public validate(payload:JwtContent){
    return {userId:+payload.sub,username:payload.username,provider:payload.provider}
  }
}
