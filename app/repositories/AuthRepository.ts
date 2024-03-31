import axios from "axios";
import type { AxiosResponse } from 'axios'
import type { CreateUserRequest } from "../contracts/auth/CreateUserRequest";
import type { LoginUserRequest } from "../contracts/auth/LoginUserRequest";
import type { TokenResponse } from "../contracts/auth/TokenResponse";

export interface AuthRepository {
    login(request: LoginUserRequest): Promise<AxiosResponse<TokenResponse>>
    register(request: CreateUserRequest): Promise<AxiosResponse<void>>
}

export class AuthRepositoryAPI implements AuthRepository{
    API_URL = ""

    constructor() {
        this.API_URL = useRuntimeConfig().public.API_URL
    }

    async login(request: LoginUserRequest): Promise<AxiosResponse<TokenResponse>> {
        return await axios.post(`${this.API_URL}/collections/users/auth-with-password`, {
            ...request
        })
    }
    async register(request: CreateUserRequest): Promise<AxiosResponse<void>> {
        return await axios.post(`${this.API_URL}/collections/users/records`, {
            ...request
        })
    }
}