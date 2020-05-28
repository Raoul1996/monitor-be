import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import configuration from '../config/configuration';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
  constructor() {
    super({
      jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration:false,
      secretOrKey: configuration.jwt.secret
    });
  }
  public validate(...args){
    console.log(args);
    // TODO: verify
    return true
  }
}
