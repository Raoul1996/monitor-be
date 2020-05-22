import { SetMetadata } from '@nestjs/common';

export const Roles = (...args: string[]) => SetMetadata('roles', args);

export enum RolesEnum {
  ADMIN='admin'
}
