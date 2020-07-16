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
import { CreateServoDto, ServoDto, SetTurnStepDto, UpdateServoDto } from './dto/servo.dto';
import { Servo } from './interface/servo.interface';
import { RolesGuard } from '../roles/roles.guard';
import { FindOneParams } from '../common/dto/common.dto';

@Controller('servo')
@UseGuards(RolesGuard)
export class ServoController {
  constructor(private readonly servoService: ServoService) {
  }
  @Post()
  // @Roles(RolesEnum.ADMIN)
  createServo(@Body() createServoDto: CreateServoDto): Observable<Servo> {
    const servo = this.servoService.create(createServoDto)
    return servo
  }

  @Get()
  getServos(@Query('take') take:number,@Query('skip') skip:number) {
    const data = this.servoService.findAll({take,skip})
    return data
  }
  @Get(":id")
  getServoById(@Param('id') id: FindOneParams):Observable<Servo[]> {
    return of([])
  }

  @Put(':id')
  update(@Param('id') id: FindOneParams, @Body() updateServoDto: UpdateServoDto) {
    return [];
  }

  @Delete(':id')
  remove(@Param('id') id: FindOneParams) {
    return [];
  }
  @Post("rotate")
  @HttpCode(204)
  @Header('X-Svc', 'rasp')
  setRotate(@Body() setRotateDto: ServoDto): Observable<any> {
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
