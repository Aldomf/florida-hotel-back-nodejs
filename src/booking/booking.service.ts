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
  
    const { roomId, ...bookingData } = createBookingDto;
  
    return this.prisma.booking.create({
      data: {
        ...bookingData,
        bookingNumber,
        room: {
          connect: {
            id: roomId, // Connects the booking to the room with the specified ID
          },
        },
      },
    });
  }
  
  async findAll() {
    return this.prisma.booking.findMany();
  }

  async findOne(id: number) {
    return this.prisma.booking.findUnique({
      where: { id },
      include: { room: true },
    });
  }
}
