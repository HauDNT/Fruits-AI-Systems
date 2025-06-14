export interface LoginResponseInterface {
    userId: string,
    username: string,
    accessToken: string,
    role: string | number;
}