import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as path from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, In, Repository } from 'typeorm';
// import { CACHE_MANAGER } from '@nestjs/cache-manager';
// import { Cache } from 'cache-manager';
import { CreateAreaDto } from './dto/create-area.dto';
import { TableMetaData } from '@/interfaces/table';
import { Area } from '@/modules/areas/entities/area.entity';
import { generateUniqueCode } from '@/utils/generateUniqueCode';
import { omitFields } from '@/utils/omitFields';
import { GetDataWithQueryParamsDTO } from '@/modules/dtoCommons';
import { deleteFile, deleteFilesInParallel } from '@/utils/handleFiles';
import { validateAndGetEntitiesByIds } from '@/utils/validateAndGetEntitiesByIds';
import { checkAllRelationsBeforeDelete } from '@/utils/checkAllRelationsBeforeDelete';
import { getDataWithQueryAndPaginate } from '@/utils/paginateAndSearch';
import { UpdateAreaDto } from '@/modules/areas/dto/update-area.dto';

@Injectable()
export class AreasService {
  constructor(
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
    private readonly dataSource: DataSource,

    // @Inject(CACHE_MANAGER)
    // private readonly cacheManager: Cache,
  ) {}

  async findAll() {
    const areas = await this.areaRepository.find();

    areas.forEach((area, index) => {
      areas[index] = omitFields(area, ['image_url', 'created_at', 'updated_at', 'deleted_at']);
    });

    return areas;
  }

  async getAreasByQuery(data: GetDataWithQueryParamsDTO): Promise<TableMetaData<Area>> {
    // const cacheKey = `areas:query:${data.page}:${data.limit}:${data.queryString}:${data.searchFields}`;
    // const cached = await this.cacheManager.get<TableMetaData<Area>>(cacheKey);

    // if (cached) {
    //   return cached;
    // }

    const result = await getDataWithQueryAndPaginate<Area>({
      repository: this.areaRepository,
      page: data.page,
      limit: data.limit,
      queryString: data.queryString,
      searchFields: data.searchFields?.split(','),
      selectFields: ['id', 'area_code', 'area_desc', 'image_url', 'created_at', 'updated_at'],
      columnsMeta: [
        { key: 'id', displayName: 'ID', type: 'number' },
        { key: 'area_code', displayName: 'Mã khu', type: 'string' },
        { key: 'area_desc', displayName: 'Mô tả', type: 'string' },
        { key: 'created_at', displayName: 'Ngày tạo', type: 'date' },
        { key: 'updated_at', displayName: 'Ngày thay đổi', type: 'date' },
      ],
    });

    // await this.cacheManager.set(cacheKey, result, 60);

    return result;
  }

  async create(createAreaDto: CreateAreaDto, imageUrl: string) {
    const { area_desc } = createAreaDto;

    const areaExist = await this.areaRepository
      .createQueryBuilder('ar')
      .where('LOWER(ar.area_desc) = LOWER(:area_desc)', { area_desc: area_desc })
      .getOne();

    if (areaExist) {
      throw new BadRequestException('Khu phân loại đã tồn tại!');
    }

    let areaCode: string;
    let areaCodeExist: Area;

    do {
      areaCode = generateUniqueCode('Area', 6);
      areaCodeExist = await this.areaRepository.findOneBy({
        area_code: areaCode,
      });
    } while (areaCodeExist);

    const newArea = this.areaRepository.create({
      area_code: areaCode,
      area_desc,
      image_url: imageUrl,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const saveArea = await this.areaRepository.save(newArea);

    return {
      message: 'Tạo khu phân loại thành công',
      data: saveArea,
    };
  }

  async update(data: UpdateAreaDto, imageUrl?: string) {
    const { area_code, area_desc } = data;
    const area = await this.areaRepository.findOneBy({ area_code });

    if (!area) {
      throw new NotFoundException('Khu phân loại không tồn tại');
    }

    area.area_desc = area_desc;
    area.updated_at = new Date();

    if (imageUrl) {
      await deleteFile(area.image_url);
      area.image_url = imageUrl;
    }

    return await this.areaRepository.save(area);
  }

  async deleteAreas(areaIds: string[]): Promise<DeleteResult> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const areas = await validateAndGetEntitiesByIds(this.areaRepository, areaIds);

      await checkAllRelationsBeforeDelete(this.dataSource, Area, areaIds, {
        areaBelong:
          'Không thể xoá vì còn thiết bị liên kết với khu vực này. Hãy thay đổi và thử lại!',
        areaWorkAt:
          'Không thể xoá vì còn nhân viên liên kết với khu vực này. Hãy thay đổi và thử lại!',
        areaClassify:
          'Không thể xoá vì còn cấu hình Raspberry đang liên kết với khu vực này. Hãy thay đổi và thử lại!',
      });

      const deleteAreasResult = await queryRunner.manager.delete(Area, { id: In(areaIds) });
      const areaImagePaths = areas.map((area) => path.join(process.cwd(), area.image_url));
      await deleteFilesInParallel(areaImagePaths);
      await queryRunner.commitTransaction();

      return deleteAreasResult;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Xoá khu phân loại thất bại: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }
}
