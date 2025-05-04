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
    created_at: Date;
}

export interface DeviceClassificationFlat {
    id: number;
    device_code: string;
    image_url: string;
    deviceType: string;       
    deviceStatus: string;
    area: string;
    created_at: Date;
}