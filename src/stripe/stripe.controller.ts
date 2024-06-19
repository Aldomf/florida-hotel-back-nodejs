import { Controller, Param, Post } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post(':id/pay')
  async pay(@Param('id') bookingId: number) {
    return this.stripeService.createPaymentIntent(bookingId);
  }
}
