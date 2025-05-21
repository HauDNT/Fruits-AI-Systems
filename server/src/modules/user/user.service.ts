import {BadRequestException, HttpException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
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
        try {
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
        } catch (e) {
            console.log('Error when create user: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình tạo người dùng mới');
        }
    }

    findAll() {
        return `This action returns all user`;
    }

    async getUsersByQuery(data: GetDataWithQueryParamsDTO): Promise<TableMetaData<User>> {
        try {
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
        } catch (e) {
            console.log('Lỗi: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình lấy danh sách tài khoản người dùng');
        }
    }

    findOne(id: number) {
        return `This action returns a #${id} user`;
    }

    async deleteUsers(userIds: string[]): Promise<DeleteResult> {
        try {
            const checkBeforeDelete = await this.userRepository.findBy({ id: In(userIds) })
            if (checkBeforeDelete.length) {
                return await this.userRepository.delete(userIds)
            } else {
                throw new BadRequestException('Tài khoản người dùng không tồn tại')
            }
        } catch (e) {
            console.log('Error when delete users: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình xoá tài khoản người dùng');
        }
    }
}
