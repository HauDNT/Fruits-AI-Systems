export const displayImageUrlSwitchBlob = (imageUrl: string) => {
    if (imageUrl.startsWith("blob:")) {
        return imageUrl;
    }

    return `${process.env.NEXT_PUBLIC_URL_SERVER}${imageUrl ?? ''}`;
}