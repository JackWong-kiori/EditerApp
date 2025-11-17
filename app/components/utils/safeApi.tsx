import AsyncStorage from "@react-native-async-storage/async-storage";
import { CancelablePromise } from "../../api";

const defaultTimeout = 1000;

export function safeApi<T>(
    apiMethod: (...args: any[]) => CancelablePromise<T>,
    args: any[] = [],
    timeout = defaultTimeout
): Promise<T> {
    return new Promise((resolve, reject) => {
        const request = apiMethod(...args);

        const timer = setTimeout(() => {
            request.cancel();
            reject(new Error("API timeout"));
        }, timeout);

        request
            .then(result => {
                clearTimeout(timer);
                resolve(result);
            })
            .catch(err => {
                clearTimeout(timer);
                reject(err);
            });
    });
}


export async function safeApiWithFallback<T>(
    apiMethod: (...args: any[]) => CancelablePromise<T>,
    args: any[] = [],
    fallbackKey: string,
    timeout = defaultTimeout
): Promise<T> {

    return new Promise(async (resolve, reject) => {
        const request = apiMethod(...args);

        const timer = setTimeout(() => {
            request.cancel();
            console.warn(`API timeout → fallback to local [${fallbackKey}]`);
        }, timeout);

        request
            .then(async (result) => {
                clearTimeout(timer);
                await AsyncStorage.setItem(fallbackKey, JSON.stringify(result));
                resolve(result);
            })
            .catch(async (err) => {
                clearTimeout(timer);
                const localJson = await AsyncStorage.getItem(fallbackKey);
                if (localJson) {
                    resolve(JSON.parse(localJson) as T);
                    return;
                }
                reject(err);
            });
    });
}
