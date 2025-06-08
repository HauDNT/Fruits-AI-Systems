import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from "@/modules/user/dto/update-user.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, In, IsNull, Like, Repository} from "typeorm";
import {User} from "@/modules/user/entities/user.entity";
import {hashPassword} from "@/utils/bcrypt";
import {GetDataWithQueryParamsDTO} from "@/modules/dtoCommons";
import {TableMetaData} from "@/interfaces/table";
import {validateAndGetEntitiesByIds} from "@/utils/validateAndGetEntitiesByIds";
import {getDataWithQueryAndPaginate} from "@/utils/paginateAndSearch";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {
    }

    async create(createUserDto: CreateUserDto) {
        const { username, password } = createUserDto
        const checkExistUser = await this.userRepository.findOneBy({ username: username })

        if (checkExistUser) {
            throw new BadRequestException(`Người dùng với ${username} đã tồn tại`)
        }

        const passwordHashed = await hashPassword(password)

        const newUser = this.userRepository.create({
            username,
            password: passwordHashed,
            created_at: new Date(),
            updated_at: new Date(),
        })

        await this.userRepository.save(newUser)

        return {
            message: 'Tạo tài khoản thành công',
            data: newUser,
        };
    }

    async getUsersByQuery(data: GetDataWithQueryParamsDTO): Promise<TableMetaData<User>> {
        return getDataWithQueryAndPaginate({
            repository: this.userRepository,
            page: data.page,
            limit: data.limit,
            queryString: data.queryString,
            searchFields: data.searchFields?.split(','),
            selectFields: ['id', 'username', 'created_at', 'updated_at'],
            columnsMeta: [
                {"key": "id", "displayName": "ID", "type": "number"},
                {"key": "username", "displayName": "Tên tài khoản", "type": "string"},
                {"key": "created_at", "displayName": "Ngày tạo", "type": "date"},
                {"key": "updated_at", "displayName": "Ngày cập nhật", "type": "date"},
            ],
        });
    }

    async updateUser(data: UpdateUserDto) {
        const user = await this.userRepository.findOneBy({username: data.username})

        if (!user) {
            throw new BadRequestException('Tài khoản người dùng không tồn tại')
        }

        const hashedPassword = await hashPassword(data.password)

        await this.userRepository.save({
            ...user,
            password: hashedPassword,
            updated_at: new Date(),
        })

        return {
            status: 200,
            message: `Cập nhật tài khoản ${data.username} thành công`
        }
    }

    async deleteUsers(userIds: string[]): Promise<DeleteResult> {
        await validateAndGetEntitiesByIds(this.userRepository, userIds);
        return await this.userRepository.delete(userIds)
    }
}
