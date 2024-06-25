import { BadRequestException, Body, Controller, Param, Post } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post(':id/pay')
async pay(@Param('id') id: string) {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    throw new BadRequestException('Invalid booking ID');
  }
  return this.stripeService.createPaymentIntent(numericId);
}


  @Post('webhook')
  async handleWebhook(@Body() body: any) {
    const event = body;

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        await this.stripeService.handlePaymentSuccess(session.client_reference_id);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return { received: true };
  }
}
