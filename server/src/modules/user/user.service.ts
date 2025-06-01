import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from "@/modules/user/dto/update-user.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, In, IsNull, Like, Repository} from "typeorm";
import {User} from "@/modules/user/entities/user.entity";
import {hashPassword} from "@/utils/bcrypt";
import {GetDataWithQueryParamsDTO} from "@/modules/dtoCommons";
import {TableMetaData} from "@/interfaces/table";

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
        const {
            page,
            limit,
            queryString,
            searchFields,
        } = data;

        const skip = (page - 1) * limit;
        const take = limit;

        const where: any = {};
        where.deleted_at = IsNull();

        let searchConditions: any[] = [];
        if (queryString && searchFields) {
            const fields = searchFields.split(',').map((field) => field.trim());
            searchConditions = fields.map((field) => ({
                ...where,
                [field]: Like(`%${queryString}%`),
            }));
        }

        const [users, total] = await this.userRepository.findAndCount({
            where: searchConditions.length > 0 ? searchConditions : where,
            select: ['id', 'username', 'created_at', 'updated_at'],
            skip,
            take,
        })

        const totalPages = Math.ceil(total / limit)

        return {
            "columns": [
                {"key": "id", "displayName": "ID", "type": "number"},
                {"key": "username", "displayName": "Tên tài khoản", "type": "string"},
                {"key": "created_at", "displayName": "Ngày tạo", "type": "date"},
                {"key": "updated_at", "displayName": "Ngày cập nhật", "type": "date"},
            ],
            "values": users,
            "meta": {
                "totalItems": total,
                "currentPage": page,
                "totalPages": totalPages,
                "limit": limit,
            },
        };
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
        const checkBeforeDelete = await this.userRepository.findBy({ id: In(userIds) })
        if (checkBeforeDelete.length) {
            return await this.userRepository.delete(userIds)
        } else {
            throw new BadRequestException('Tài khoản người dùng không tồn tại')
        }
    }
}
