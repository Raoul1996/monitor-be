import { Injectable } from '@nestjs/common';

@Injectable()
export class CryptoService {
  genSalt():string{
    return '1111111'
  }
  hashPassword(pwd:string,salt:string):string{
    return '1111'
  }
}
