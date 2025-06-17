export const getValidImageUrl = (imageUrl: string): string => {
    if (!imageUrl) return "/default-image.png";

    if (
        imageUrl.startsWith("blob:") || 
        imageUrl.startsWith("data:image/")
    ) {
        return imageUrl;
    }

    return `${process.env.NEXT_PUBLIC_URL_SERVER}${imageUrl}`;
};
