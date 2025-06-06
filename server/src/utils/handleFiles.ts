import * as fs from 'fs';
import * as path from 'path';

export async function deleteFile(filePath: string): Promise<void> {
    try {
        const fullPath = path.join(process.cwd(), filePath);

        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
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
            await fs.unlinkSync(filePath)
        } catch (error) {
            console.error('Lỗi khi xoá file:', error.message);
        }
    });

    await Promise.allSettled(deletePromises)
}