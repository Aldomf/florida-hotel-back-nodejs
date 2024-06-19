import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { BookingModule } from 'src/booking/booking.module';

@Module({
  imports: [BookingModule],
  controllers: [StripeController],
  providers: [StripeService],
})
export class StripeModule {}
