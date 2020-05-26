import { Injectable } from '@nestjs/common';
import { pbkdf2Sync } from 'crypto';

@Injectable()
export class CryptoService {
  private genSalt(len = 5):string{
    return Math.random().toString(32).slice(2,2+len)
  }
  private getHash(pwd,salt){
    return pbkdf2Sync(pwd,salt,2048,32,'sha512').toString('hex')
  }
  public hashPassword(pwd:string):string{
    const salt = this.genSalt(5)
    const hash = this.getHash(pwd,salt)
    return [hash,salt].join('$')
  }
  public validatePassword(saltedPwd:string,candidatePwd:string):boolean{
    const [originalHash,salt] = saltedPwd.split('$')
    if (!originalHash || !salt) {
      throw new Error("error salt password")
    }
    const hash = this.getHash(candidatePwd,salt)
    return hash === originalHash
  }
}
