import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Room } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import * as util from 'util';
import { config } from 'dotenv';
config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const writeFileAsync = util.promisify(fs.writeFile);
const unlinkAsync = util.promisify(fs.unlink);

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createRoomDto: CreateRoomDto,
    imageFiles: Express.Multer.File[],
  ): Promise<Room> {
    // Check if a room with the same room number already exists
    const existingRoom = await this.prisma.room.findFirst({
      where: { roomNumber: createRoomDto.roomNumber },
    });

    if (existingRoom) {
      throw new NotFoundException(
        `Room with room number ${createRoomDto.roomNumber} already exists.`,
      );
    }

    // Save the images to Cloudinary and get their URLs
    const imageUrls = imageFiles ? await this.saveImages(imageFiles) : [];

    // Convert pricePerNight, capacity, and roomSize to the correct data types
    const { pricePerNight, capacity, roomSize, ...rest } = createRoomDto;
    const data = {
      ...rest,
      pricePerNight: parseFloat(pricePerNight),
      capacity: parseInt(capacity, 10),
      roomSize: parseFloat(roomSize),
      imageUrls,
    };

    // If no existing room is found, proceed with creating the new room
    const createdRoom = await this.prisma.room.create({
      data,
    });

    return createdRoom;
  }

  //find all rooms
  async findAll(): Promise<Room[]> {
    return await this.prisma.room.findMany();
  }

  //find one room
  async findOne(id: number): Promise<Room | null> {
    const room = await this.prisma.room.findUnique({
      where: { id },
    });

    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    return room;
  }

  //   async update(id: number, updateRoomDto: UpdateRoomDto, imageFiles: Express.Multer.File[]): Promise<Room> {
  //     // Find the room by ID
  //     const room = await this.prisma.room.findUnique({
  //       where: { id },
  //     });

  //     if (!room) {
  //       throw new NotFoundException(`Room with ID ${id} not found`);
  //     }

  //     // Save the new images to Cloudinary and get their URLs
  //     const newImageUrls = await this.saveImages(imageFiles);

  //     // Concatenate the existing image URLs with the new ones
  //     const updatedImageUrls = [...room.imageUrls, ...newImageUrls];

  //     // Update the room properties including image URLs
  //     const updatedRoom = await this.prisma.room.update({
  //       where: { id },
  //       data: {
  //         ...updateRoomDto, // Update with the provided DTO fields
  //         pricePerNight: parseFloat(updateRoomDto.pricePerNight),
  //         capacity: parseInt(updateRoomDto.capacity, 10),
  //         roomSize: parseFloat(updateRoomDto.roomSize),
  //         imageUrls: updatedImageUrls,
  //         // Update other fields as needed
  //       },
  //     });

  //     return updatedRoom;
  // }

  //update room
  async update(
    id: number,
    updateRoomDto: UpdateRoomDto,
    imageFiles: Express.Multer.File[],
  ): Promise<Room> {
    // Find the room by ID
    const room = await this.prisma.room.findUnique({
      where: { id },
    });
  
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
  
    let updatedImageUrls: string[] = room.imageUrls;
  
    // Save the new images to Cloudinary and get their URLs
    if (imageFiles && imageFiles.length > 0) {
      const newImageUrls = await this.saveImages(imageFiles);
      // Concatenate the existing image URLs with the new ones
      updatedImageUrls = [...updatedImageUrls, ...newImageUrls];
    }
  
    // Delete the images at the specified indices if provided
    if (
      updateRoomDto.imageIndicesToDelete &&
      updateRoomDto.imageIndicesToDelete.length > 0
    ) {
      const imagesToDelete = updateRoomDto.imageIndicesToDelete.map(
        (index) => room.imageUrls[index],
      );
      console.log(imagesToDelete);
      // Filter out the image URLs that need to be deleted from the room's imageUrls
      updatedImageUrls = room.imageUrls.filter(
        (url) => !imagesToDelete.includes(url),
      );

      await this.deleteImagesFromCloudinary(imagesToDelete);
    }

    console.log(updatedImageUrls);
  
    // Prepare the update data
    const updateData = {
      ...updateRoomDto,
      pricePerNight: parseFloat(updateRoomDto.pricePerNight),
      capacity: parseInt(updateRoomDto.capacity, 10),
      roomSize: parseFloat(updateRoomDto.roomSize),
      imageUrls: updatedImageUrls,
    };
  
    // Remove fields that should not be updated directly in the database
    delete updateData.imageIndicesToDelete;
  
    // Update the room properties including image URLs
    const updatedRoom = await this.prisma.room.update({
      where: { id },
      data: updateData,
    });
  
    return updatedRoom;
  }
  

  
  

  //delete room
  async remove(id: number): Promise<Room> {
    const room = await this.prisma.room.findUnique({
      where: { id },
    });

    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    // Delete the existing images from Cloudinary
    await this.deleteImagesFromCloudinary(room.imageUrls);

    return await this.prisma.room.delete({ where: { id } });
  }

  //Save Image in cloudinary
  async saveImages(imageFiles?: Express.Multer.File[]): Promise<string[]> {
    try {
      if (!imageFiles || imageFiles.length === 0) {
        return [];
      }

      const uploadedImageUrls: string[] = [];

      // Upload each file to Cloudinary
      for (const imageFile of imageFiles) {
        const tempFilePath = `temp-${Date.now()}.${imageFile.originalname.split('.').pop()}`;
        await writeFileAsync(tempFilePath, imageFile.buffer);

        // Upload the temporary file to Cloudinary
        const result = await cloudinary.uploader.upload(tempFilePath, {
          folder: 'florida-hotel-rooms', // Optional: Specify a folder in Cloudinary to organize your images
        });

        // Collect the URL of the uploaded image
        uploadedImageUrls.push(result.secure_url);

        // Delete the temporary file
        await unlinkAsync(tempFilePath);
      }

      // Return the array of uploaded image URLs
      return uploadedImageUrls;
    } catch (error) {
      console.error('Error saving images to Cloudinary:', error);
      throw new Error('Failed to save image');
    }
  }

  // Method to delete images from Cloudinary
  async deleteImagesFromCloudinary(imageUrls: string[]): Promise<void> {
    try {
      for (const imageUrl of imageUrls) {
        // Extract the public ID of the image from the Cloudinary URL
        const publicId = this.extractPublicIdFromImageUrl(imageUrl);

        if (publicId) {
          // Delete the image from Cloudinary using its public ID
          await cloudinary.uploader.destroy(publicId);
          console.log(`Image deleted from Cloudinary. Public ID: ${publicId}`);
        }
      }
    } catch (error) {
      console.error('Error deleting images from Cloudinary:', error);
      throw new Error('Failed to delete images from Cloudinary');
    }
  }

  // Helper method to extract public ID from Cloudinary image URL along with the folder name
  extractPublicIdFromImageUrl(imageUrl: string): string | null {
    try {
      // Split the URL by '/' and get the last part (public ID)
      const parts = imageUrl.split('/');
      return `florida-hotel-rooms/${parts.pop()?.split('.')[0] || null}`;
    } catch (error) {
      console.error('Error extracting public ID from image URL:', error);
      return null;
    }
  }
}
