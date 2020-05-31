import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptions } from 'passport-github2';
import configuration from '../../config/configuration';
import { AuthService } from '../auth.service';

export interface GithubProfile {
  id: string,
  nodeId:string,
  displayName:string,
  username:string,
  profileUrl:string,
  photos:Array<{value:string}>,
  provider:'github',
  _raw:string;
  _json:{
    login:string;
    id:number,
    node_id:string,
    avatar_url:string,
    gravatar_id:string,
    name:string,
  },
  emails:Array<{value:string}>
}

export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: configuration.oAuth.github.clientId,
      clientSecret: configuration.oAuth.github.clientSecret,
      callbackURL: configuration.oAuth.github.callbackURL,
      scope: ['user:email'],
      userAgent:'monitor_be'
    });
  }

  validate(accessToken: string, refreshToken: string, profile: GithubProfile, done: Function) {
    console.log(accessToken, refreshToken, profile, done);
    console.log(this.authService);
    done(null, { ...profile, jwt: accessToken });
  }

}
