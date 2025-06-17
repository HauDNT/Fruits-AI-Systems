import { ImageFrameElement } from '@/types/index'

export type ImageFrameInterface = {
    id?: string | number;
    willDelete?: boolean;
} & {
    [K in ImageFrameElement]?: string;
};
