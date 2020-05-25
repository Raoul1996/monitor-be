import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CryptoService } from './crypto/crypto.service';

@Module({
  providers:[AuthService, CryptoService]
})
export class AuthModule {}
