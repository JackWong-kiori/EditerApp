/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Customer } from '../models/Customer';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CustomerApiService {
    /**
     * @returns Customer OK
     * @throws ApiError
     */
    public static getApiCustomersGetAll(): CancelablePromise<Array<Customer>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/customers/GetAll',
        });
    }
    /**
     * @param requestBody
     * @returns Customer OK
     * @throws ApiError
     */
    public static postApiCustomersCreateCustomer(
        requestBody?: Customer,
    ): CancelablePromise<Customer> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/customers/CreateCustomer',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
