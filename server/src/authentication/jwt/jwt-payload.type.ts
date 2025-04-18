export interface JWTLoginPayload {
    userId: number | string,
    username?: string,
    provider_token?: string,
}