import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CryptoService } from './crypto/crypto.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import configuration from '../config/configuration';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { LoggerModule } from '../logger/logger.module';
import { GithubStrategy } from './strategies/github.strategy';

@Module({
  imports: [
    PassportModule.register({defaultStrategy:'jwt'}),
    JwtModule.register({
      secret: configuration.jwt.secret,
    }),
    UserModule,
    LoggerModule
  ],
  providers: [AuthService, CryptoService, JwtStrategy,GithubStrategy],
  exports:[AuthService],
  controllers: [AuthController]
})
export class AuthModule {
}
