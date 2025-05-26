import {Controller, Get, Post, Body, Param, Delete, Query} from '@nestjs/common';
import {UserService} from './user.service';
import {CreateUserDto} from './dto/create-user.dto';
import {TableMetaData} from "@/interfaces/table";
import {User} from "@/modules/user/entities/user.entity";
import {DeleteResult} from "typeorm";
import {DeleteUserDto} from "@/modules/user/dto/delete-user.dto";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Post('/create-user')
    async create(@Body() createUserDto: CreateUserDto) {
        return await this.userService.create(createUserDto);
    }

    @Get('/all')
    findAll() {
        return this.userService.findAll();
    }

    @Get()
    async getUsersByQuery(
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('queryString') queryString: string,
        @Query('searchFields') searchFields: string,
    ): Promise<TableMetaData<User>> {
        return await this.userService.getUsersByQuery({
            page,
            limit,
            queryString,
            searchFields,
        })
    }

    @Delete('/delete-users')
    async deleteUsers(
        @Body() data: DeleteUserDto
    ): Promise<DeleteResult> {
        const { userIds } = data;
        return await this.userService.deleteUsers(userIds);
    }
}
