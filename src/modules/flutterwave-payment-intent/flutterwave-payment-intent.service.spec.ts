import { Test, TestingModule } from '@nestjs/testing';
import { FlutterwavePaymentIntentService } from './flutterwave-payment-intent.service';

describe('FlutterwavePaymentIntentService', () => {
  let service: FlutterwavePaymentIntentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlutterwavePaymentIntentService],
    }).compile();

    service = module.get<FlutterwavePaymentIntentService>(FlutterwavePaymentIntentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
