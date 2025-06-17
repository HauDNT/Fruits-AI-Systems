import { ImageFrameInterface } from "@/interfaces/imageFrame";
import { getValidImageUrl } from "@/utils/displayImageUrlSwitchBlob";
import Image from "next/image";

interface ImageFramesProp {
    images: ImageFrameInterface[],
    onDelete?: boolean,
    onImageDelete?: (imageId: string | number) => void,
}

const ImageFrames = ({
    images,
    onDelete = false,
    onImageDelete,
}: ImageFramesProp) => {
    return (
        <div className="flex flex-wrap gap-3">
            {images.map((image, index) => {
                if (!image || image.willDelete) return null;

                const key = image.id ?? `client-${index}`;

                return (
                    <div
                        key={key}
                        className="relative w-[100px] h-[100px] border border-gray-200 rounded-sm overflow-hidden dark:border-gray-800"
                    >
                        {onDelete && onImageDelete && (
                            <button
                                onClick={() => image.id && onImageDelete(image.id)}
                                className="absolute top-0 right-0 z-10 px-1 text-white bg-red-600 rounded-bl-sm hover:bg-red-700"
                            >
                                ✕
                            </button>
                        )}
                        <Image
                            width={100}
                            height={100}
                            src={getValidImageUrl(image.image_url ?? '')}
                            alt="Unknown image"
                            className="object-cover w-full h-full"
                            unoptimized
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default ImageFrames;
