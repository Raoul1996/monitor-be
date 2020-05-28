import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptions } from 'passport-github2';
import configuration from '../config/configuration';
import { Request } from 'express';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserService } from '../user/user.service';

export interface githubProfile {
  id: number | string
}

export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private readonly userService:UserService) {
    super({
      clientID: configuration.oAuth.github.clientId,
      clientSecret: configuration.oAuth.github.clientSecret,
      callbackURL: configuration.oAuth.github.callbackURL,
      scope: ['user:email'],
    }, (accessToken: string, refreshToken: string, profile: githubProfile, done: Function) => {
      console.log(refreshToken,profile,done)
      done(null, { ...profile, jwt: accessToken });
    });
  }

}
