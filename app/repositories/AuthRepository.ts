import type { CreateUserRequest } from "../contracts/auth/CreateUserRequest";
import type { LoginUserRequest } from "../contracts/auth/LoginUserRequest";
import type { TokenResponse } from "../contracts/auth/TokenResponse";

export interface AuthRepository {
    login(request: LoginUserRequest): Promise<TokenResponse>
    register(request: CreateUserRequest): Promise<TokenResponse>
}

export class AuthRepositoryAPI implements AuthRepository{

    async login(request: LoginUserRequest): Promise<TokenResponse> {
        return await $fetch("/api/collections/users/auth-with-password", {
            method: 'POST',
            body: request
        })
    }
    register(request: CreateUserRequest): Promise<TokenResponse> {
        throw new Error("Method not implemented.");
    }

}