import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { userProviders } from './user.providers';
import { DatabaseModule } from '../database/database.module';
import { CryptoService } from '../auth/crypto/crypto.service';
import { UserController } from './user.controller';

@Module({
  imports:[DatabaseModule],
  controllers: [UserController],
  providers: [...userProviders,CryptoService,UserService]
})
export class UserModule {}
