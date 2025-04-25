/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthRequest } from '../models/AuthRequest';
import type { AuthRequestByCode } from '../models/AuthRequestByCode';
import type { AuthResponse } from '../models/AuthResponse';
import type { RefreshRequest } from '../models/RefreshRequest';
import type { UserProfile } from '../models/UserProfile';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import { UserList } from '../models/UserList';
export class AuthService {
    /**
     * User login
     * @returns AuthResponse Auth tokens
     * @throws ApiError
     */
    public static postAuthLogin({
        requestBody,
    }: {
        requestBody: AuthRequest,
    }): CancelablePromise<AuthResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * User login by code
     * @returns AuthResponse Auth tokens
     * @throws ApiError
     */
    public static postAuthLoginByCode({
        requestBody,
    }: {
        requestBody: AuthRequestByCode,
    }): CancelablePromise<AuthResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/login-code',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Refresh JWT token
     * @returns AuthResponse New auth tokens
     * @throws ApiError
     */
    public static postAuthRefresh({
        requestBody,
    }: {
        requestBody: RefreshRequest,
    }): CancelablePromise<AuthResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/refresh',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get current user info
     * @returns UserProfile User profile
     * @throws ApiError
     */
    public static getAuthMe(): CancelablePromise<UserProfile> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/me',
        });
    }
    /**
     * Get current users list
     * @returns UserProfile User profile
     * @throws ApiError
     */
    public static getUsersList(): CancelablePromise<UserList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/user/list',
        });
    }
    /**
     * Register device FCM token
     * @returns any Success
     * @throws ApiError
     */
    public static postAuthFcm({
        requestBody,
    }: {
        requestBody: {
            fcm_token: string;
        },
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/fcm',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
