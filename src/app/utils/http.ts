import axios, { AxiosInstance, RawAxiosRequestHeaders, AxiosHeaders } from "axios";
import { headers } from "next/headers";

interface IResOptions {
    useAccessToken?: boolean
}

class HTTP {
    private axiosInstance: AxiosInstance
    constructor (){
        this.axiosInstance = axios.create(
            {
                baseURL: "https://backend-server-419313.de.r.appspot.com/api",
                // baseURL: "http://localhost:3001/api",
                timeout: 10000,
                headers: {
                    "Content-Type": 'application/json'
                }
            }
        )
    }
    public async get(url: string, params: any) {
        try {
            const result = await this.axiosInstance.get(url, { params });
            return result
        } catch (error) {
            console.log(error)
        }
    }

    public async getWithAutoRefreshToken(url: string, options: IResOptions): Promise<any> {
        try {
            const requestHeader: RawAxiosRequestHeaders | AxiosHeaders = {};

            if (options.useAccessToken) {
                const accessToken = localStorage.getItem('accessToken');
                if (accessToken) {
                    requestHeader.authorization = `Bearer ${accessToken}`;
                }
            }
            const result = await this.axiosInstance.get(url, {
                headers: requestHeader
            });
            return result.data;
        } catch (error) {
            throw error;
        }
    }


    public async postWithAutoRefreshToken(url: string, data: any, options: IResOptions): Promise<any> {
        try {
            const requestHeader: (RawAxiosRequestHeaders) | AxiosHeaders = {};
            if (options.useAccessToken) {
                requestHeader.authorization = `Bearer ${localStorage.getItem('accessToken')}`
            }
            const result = await this.axiosInstance.post(url, data, {
                headers: requestHeader
            })
            return result.data
        } catch (error) {
            throw error;
        }
    }
    public async postWithAutoRefreshTokenMultipart(url: string, data: any, options: IResOptions): Promise<any> {
        try {
            const requestHeader: (RawAxiosRequestHeaders) | AxiosHeaders = {};
            if (options.useAccessToken) {
                requestHeader.authorization = `Bearer ${localStorage.getItem('accessToken')}`
            }
            requestHeader['Content-Type'] = 'multipart/form-data'
            const result = await this.axiosInstance.post(url, data, {
                headers: requestHeader
            })
            return result.data
        } catch (error) {
            throw error
        }
    }
    public async putWithAutoRefreshToken(url: string, data: any, options: IResOptions): Promise<any> {
        try {
            const requestHeader: (RawAxiosRequestHeaders) | AxiosHeaders = {};

            if (options.useAccessToken) {
                requestHeader.authorization = `Bearer ${localStorage.getItem('accessToken')}`
            }
            const result = await this.axiosInstance.put(url, data, {
                headers: requestHeader
            })

            return result.data
        } catch (error) {
            throw error
        }
    }
    public async deleteWithAutoRefreshToken(url: string, options: IResOptions): Promise<any> {
        try {
            const requestHeader: RawAxiosRequestHeaders | AxiosHeaders = {};

            if (options.useAccessToken) {
                requestHeader.authorization = `Bearer ${localStorage.getItem('accessToken')}`;
            }

            const result = await this.axiosInstance.delete(url, {
                headers: requestHeader
            });

            return result.data;
        } catch (error) {
            throw error;
        }
    }

}

const http = new HTTP()

export default http
