import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

const matchRoles = (roles:string[],userRoles:string[])=>{
  return true
}
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector:Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const roles = this.reflector.get<string[]>("roles",context.getHandler())
    if (!roles){
      return true
    }
    const request = context.switchToHttp().getRequest()
    const user = request.user
    return  matchRoles(roles,user.roles)
  }
}


