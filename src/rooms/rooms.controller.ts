import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  create(
    @Body() createRoomDto: CreateRoomDto,
    @UploadedFiles() imageFiles: Express.Multer.File[],
  ) {
    return this.roomsService.create(createRoomDto, imageFiles);
  }

  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(+id);
  }

  @Patch(':id')
@UseInterceptors(FilesInterceptor('images'))
update(
  @Param('id') id: string,
  @Body() updateRoomDto: UpdateRoomDto,
  @UploadedFiles() imageFiles: Express.Multer.File[],
) {
  return this.roomsService.update(+id, updateRoomDto, imageFiles);
}

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomsService.remove(+id);
  }
}
