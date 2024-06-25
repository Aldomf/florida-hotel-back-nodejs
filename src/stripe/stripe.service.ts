import { Injectable, NotFoundException } from '@nestjs/common';
import { BookingService } from 'src/booking/booking.service';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private readonly bookingService: BookingService,) {
    this.stripe = new Stripe(process.env.STRIPE_API_KEY, {
      apiVersion: '2024-04-10',
    });
  }

  async createCheckoutSession(bookingId: number) {
    console.log(bookingId);
    const booking = await this.bookingService.findOne(bookingId);

    if (!booking || !booking.room) {
      throw new Error('Booking or related room not found');
    }

    const room = booking.room;

    const item = {
      name: `${room.roomNumber}-${room.roomType}`,
      description: room.description,
      imageUrl: room.imageUrls[0],
      price: room.pricePerNight,
    };

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name,
              description: item.description,
              images: [item.imageUrl],
            },
            unit_amount: parseFloat((booking.price * 100).toFixed(2)),
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId,
      },
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/my-reservations?bookingId=${bookingId}&status=success`,
      cancel_url: `${process.env.FRONTEND_URL}/booking-cancelled`,
      client_reference_id: bookingId.toString(),
    });

    return session;
  }

  async handlePaymentSuccess(bookingId: string) {
    const id = parseInt(bookingId, 10);
    if (isNaN(id)) {
      throw new Error('Invalid booking ID');
    }
  
    await this.bookingService.updatePaymentStatus(id, 'paid');
  }
  

  async createPaymentIntent(
    bookingId: number,
  ) {
    // Verify the booking exists
    const booking = await this.bookingService.findOne(bookingId)

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Create a payment intent
    return this.createCheckoutSession(bookingId);
  }
}

