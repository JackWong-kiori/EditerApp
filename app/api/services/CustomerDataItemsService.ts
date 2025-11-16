/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CustomerDataItem } from '../models/CustomerDataItem';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CustomerDataItemsService {
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static getApiCustomerDataItemsCheck(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/CustomerDataItems/check',
        });
    }
    /**
     * @param customerId
     * @returns CustomerDataItem OK
     * @throws ApiError
     */
    public static getApiCustomerDataItemsGetListByCustomerId(
        customerId: number,
    ): CancelablePromise<Array<CustomerDataItem>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/CustomerDataItems/GetListByCustomerId/{customerId}',
            path: {
                'customerId': customerId,
            },
        });
    }
    /**
     * @param requestBody
     * @returns CustomerDataItem OK
     * @throws ApiError
     */
    public static postApiCustomerDataItems(
        requestBody?: CustomerDataItem,
    ): CancelablePromise<CustomerDataItem> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/CustomerDataItems',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static putApiCustomerDataItems(
        id: number,
        requestBody?: CustomerDataItem,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/CustomerDataItems/{Id}',
            path: {
                'Id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static putApiCustomerDataItemsLock(
        id: number,
        requestBody?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/CustomerDataItems/lock/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any OK
     * @throws ApiError
     */
    public static putApiCustomerDataItemsUnlock(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/CustomerDataItems/unlock/{id}',
            path: {
                'id': id,
            },
        });
    }
}
