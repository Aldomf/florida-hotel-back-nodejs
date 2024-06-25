import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async create(createBookingDto: CreateBookingDto) {
    // Generate a unique booking number based on timestamp and room ID
    const bookingNumber = this.generateBookingNumber(createBookingDto.roomId);

    const { roomId, ...bookingData } = createBookingDto;

    return this.prisma.booking.create({
      data: {
        ...bookingData,
        bookingNumber,
        paymentStatus: 'pending',
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

  async updatePaymentStatus(id: number, status: string) {
    return this.prisma.booking.update({
      where: {
        id: id, // Ensure id is a number
      },
      data: {
        paymentStatus: status, // Set the payment status to the provided status
      },
    });
  }
  

  async findBookingNumber(bookingNumber: string) {
    return this.prisma.booking.findUnique({
      where: { bookingNumber },
      include: { room: true },
    });
  }

  private generateBookingNumber(roomId: number): string {
    const timestamp = Date.now().toString(36); // Convert current timestamp to base-36 string
    const randomString = Math.random().toString(36).substr(2, 6); // Generate a random string of 6 characters
  
    // Calculate the length needed for room ID to ensure total length is 10 characters
    const roomIdString = String(roomId).padStart(4, '0'); // Assume roomId is padded to ensure consistent length
  
    // Concatenate timestamp, room ID, and random string to create a unique booking number
    const bookingNumber = `${timestamp}${roomIdString}${randomString}`.substr(0, 10); // Limit to 10 characters
  
    return bookingNumber.toUpperCase(); // Convert to uppercase for consistency (optional)
  }
  
  
}
