import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  async create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }

  @Get()
  async findAll() {
    return this.bookingService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.bookingService.findOne(+id);
  }

  @Post('find')
  async findBookingNumber(@Body('bookingNumber') bookingNumber: string) {
    const booking = await this.bookingService.findBookingNumber(bookingNumber);

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }
}
