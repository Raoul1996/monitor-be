import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { userProviders } from './user.providers';
import { DatabaseModule } from '../database/database.module';
import { CryptoService } from '../auth/crypto/crypto.service';
import { UserController } from './user.controller';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports:[DatabaseModule,LoggerModule],
  controllers: [UserController],
  providers: [...userProviders,CryptoService,UserService],
  exports:[UserService]
})
export class UserModule {}
