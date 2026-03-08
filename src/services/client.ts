import axios, { AxiosInstance, AxiosError } from 'axios';

/**
 * API配置常量
 */
export const API_CONFIG = {
  /** Ticketmaster API密钥 */
  API_KEY: 'AJIubp2Y9E8NY4rBrYmVt2nJqHjghF8S',
  /** API基础URL */
  BASE_URL: 'https://app.ticketmaster.com/discovery/v2',
  /** 默认分页大小 */
  DEFAULT_PAGE_SIZE: 20,
  /** 默认国家代码 */
  DEFAULT_COUNTRY_CODE: 'US'
};

/**
 * 自定义API错误类
 */
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * 创建axios实例
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * 处理API错误
 * @param error 错误对象
 * @param operation 操作名称
 * @returns 格式化的错误信息
 */
export const handleApiError = (error: unknown, operation: string): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status || 500;
    // 处理响应数据，确保message属性存在
    const responseData = axiosError.response?.data;
    const message = typeof responseData === 'object' && responseData !== null && 'message' in responseData 
      ? String(responseData.message) 
      : `API请求失败: ${operation}`;
    
    console.error(`${operation}失败:`, message);
    throw new ApiError(message, status);
  }
  
  const errorMessage = error instanceof Error ? error.message : '未知错误';
  console.error(`${operation}失败:`, errorMessage);
  throw new ApiError(errorMessage, 500);
};

export default apiClient;