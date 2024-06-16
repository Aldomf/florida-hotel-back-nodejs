// booking.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async create(createBookingDto: CreateBookingDto) {
    // Generate a unique booking number
    const bookingNumber = uuidv4();

    return this.prisma.booking.create({
      data: {
        ...createBookingDto,
        bookingNumber,
      },
    });
  }

  
  async findAll() {
    return this.prisma.booking.findMany();
  }

  async findOne(id: number) {
    return this.prisma.booking.findUnique({
      where: { id },
    });
  }
}
