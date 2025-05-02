import {BadRequestException} from "@nestjs/common";

const returnPrefix = ['#AR', '#DV']
type TypeUniqueCodeFor = 'Area' | 'Device'
const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function generateUniqueCode(type: TypeUniqueCodeFor, codeLength: number) {
    let codeGenerated = '';
    for (let i = 0; i < codeLength; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length)
        codeGenerated += charset[randomIndex];
    }

    switch (type) {
        case "Area":
            return `${returnPrefix[0]}-${codeGenerated}`
        case "Device":
            return `${returnPrefix[1]}-${codeGenerated}`
        default:
            throw new BadRequestException('Không tạo được mã định danh')
    }
}