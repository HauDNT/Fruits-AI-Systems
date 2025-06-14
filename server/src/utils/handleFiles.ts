import * as fs from 'fs/promises';
import * as path from 'path';

export async function deleteFile(filePath: string): Promise<void> {
    try {
        const fullPath = path.join(process.cwd(), filePath);

        if (await fs.access(fullPath).then(() => true).catch(() => false)) {
            fs.unlink(fullPath);
        } else {
            console.log('File không tồn tại:', fullPath);
        }
    } catch (error) {
        console.error('Lỗi khi xoá file:', error.message);
    }
}

export async function deleteFilesInParallel(filePaths: string[]): Promise<void> {
    const deletePromises = filePaths.map(async filePath => {
        try {
            await fs.access(filePath);
            await fs.unlink(filePath);
        } catch (error) {
            console.error('Lỗi khi xoá file:', error.message);
        }
    });

    await Promise.allSettled(deletePromises)
}