import { Test, TestingModule } from '@nestjs/testing';
import { ServoController } from './servo.controller';

describe('Servo Controller', () => {
  let controller: ServoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServoController],
    }).compile();

    controller = module.get<ServoController>(ServoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
