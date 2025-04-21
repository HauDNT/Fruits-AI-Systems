import {BadRequestException, HttpException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {CreateFruitDto} from './dto/create-fruit.dto';
import {UpdateFruitDto} from './dto/update-fruit.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Fruit} from "@/modules/fruits/entities/fruit.entity";
import {In, Repository} from "typeorm";
import {FruitType} from "@/modules/fruit-types/entities/fruit-type.entity";

@Injectable()
export class FruitsService {
    constructor(
        @InjectRepository(Fruit)
        private fruitRepository: Repository<Fruit>,
        @InjectRepository(FruitType)
        private fruitTypeRepository: Repository<FruitType>,
    ) {
    }

    async create(createFruitDto: CreateFruitDto) {
        try {
            const {fruit_name, fruit_desc, fruit_type} = createFruitDto
            const getFruitTypes = await this.fruitTypeRepository.findBy({id: In(fruit_type)});

            const checkExistFruit = await this.fruitRepository
                .createQueryBuilder('fruitName')
                .where('LOWER(fruitName.fruit_name) = LOWER(:fruit_name)', {fruit_name: fruit_name})
                .getOne()

            if (getFruitTypes.length !== fruit_type.length) {
                throw new BadRequestException('Trạng thái trái cây không hợp lệ')
            }

            if (checkExistFruit) {
                throw new BadRequestException('Trái cây đã tồn tại')
            }

            const newFruit = await this.fruitRepository.create({
                fruit_name: fruit_name,
                fruit_des: fruit_desc,
                fruitTypes: getFruitTypes,
                created_at: new Date(),
                updated_at: new Date(),
            })

            const saveFruit = await this.fruitRepository.save(newFruit)

            return {
                message: 'Tạo trái cây thành công',
                data: saveFruit,
            };
        } catch (e) {
            console.log('Lỗi: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình lấy danh sách trái cây');
        }
    }

    async findAll(): Promise<Fruit[]> {
        try {
            return await this.fruitRepository.find();
        } catch (e) {
            console.log('Lỗi: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình lấy danh sách trái cây');
        }
    }

    findOne(id: number) {
        return `This action returns a #${id} fruit`;
    }

    update(id: number, updateFruitDto: UpdateFruitDto) {
        return `This action updates a #${id} fruit`;
    }

    remove(id: number) {
        return `This action removes a #${id} fruit`;
    }
}
