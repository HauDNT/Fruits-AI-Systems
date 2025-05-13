import * as fs from 'fs';
import * as path from 'path';
import { unlink } from 'fs/promises';

export async function deleteFile(filePath: string): Promise<void> {
    try {
        const fullPath = path.join(__dirname, '..', '..', 'uploads', 'models', path.basename(filePath));

        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            console.log('Đã xoá file:', fullPath);
        } else {
            console.log('File không tồn tại:', fullPath);
        }
    } catch (error) {
        console.error('Lỗi khi xoá file:', error.message);
    }
}

