import { Test, TestingModule } from '@nestjs/testing';
import { ServoService } from './servo.service';

describe('ServoService', () => {
  let service: ServoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServoService],
    }).compile();

    service = module.get<ServoService>(ServoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
