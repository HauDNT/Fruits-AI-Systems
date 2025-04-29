export interface LoginResponse {
    userId: number;
    username: string;
    accessToken: string;
}

export interface FruitClassificationFlat {
    id: number;
    confidence_level: number;
    image_url: string;
    fruit: string;
    fruitType: string;
    area: string;
    batch: string;
    created_at: Date;
}