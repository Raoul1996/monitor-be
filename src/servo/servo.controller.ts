import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Redirect,
  UseGuards,
} from '@nestjs/common';
import { ServoService } from './servo.service';
import { Observable, of } from 'rxjs';
import { SetRotateDto, SetTurnStepDto, UpdateServoDto } from './dto/set-rotate.dto';
import { Servo } from './interfaces/servo.interface';
import { RolesGuard } from '../guard/roles.guard';
import { Roles, RolesEnum } from '../decorator/roles.decorator';
import { ServoEntity } from './servo.entity';

@Controller('servo')
@UseGuards(RolesGuard)
export class ServoController {
  constructor(private readonly servoService: ServoService) {
  }
  @Post()
  // @Roles(RolesEnum.ADMIN)
  createServo(@Body() servo: Servo): Observable<ServoEntity> {
    const servoEntity = this.servoService.create(servo)
    return servoEntity
  }

  @Get()
  getServos(@Query('take') take:number,@Query('skip') skip:number) {
    const data = this.servoService.findAll({take,skip})
    return data
  }
  @Get(":id")
  getServoById(@Param('id') id: string):Observable<Servo[]> {
    return of([])
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateServoDto: UpdateServoDto) {
    return [];
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return [];
  }
  @Post("rotate")
  @HttpCode(204)
  @Header('X-Svc', 'rasp')
  setRotate(@Body() setRotateDto: SetRotateDto): Observable<any> {
    return of(setRotateDto)
  }

  @Post("step")
  @Header('X-SVC', 'rasp')
  turnHorizontal(@Body() setTurnStep: SetTurnStepDto): Observable<any> {
    throw new HttpException("NOT_ACCEPTABLE", HttpStatus.NOT_ACCEPTABLE)
    return of(setTurnStep)
  }
  @Get()
  @Redirect('https://github.com', 308)
  @Get('status')
  getStatus(@Query('target') target: number): Observable<boolean> {
    return of(this.servoService.getStatus(target))
  }

}
