import apiClient, { API_CONFIG, handleApiError } from './client';
import type { Event, EventResponse } from '../types/event';

/**
 * 搜索事件列表
 * @param page 页码，默认1
 * @param pageSize 每页数量，默认20
 * @returns 事件列表响应数据
 * @throws ApiError 当API请求失败时
 */
export const searchEvents = async (page: number = 1, pageSize: number = API_CONFIG.DEFAULT_PAGE_SIZE): Promise<EventResponse> => {
  try {
    const response = await apiClient.get('/events', {
      params: {
        apikey: API_CONFIG.API_KEY,
        page,
        size: pageSize,
        countryCode: API_CONFIG.DEFAULT_COUNTRY_CODE
      }
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, '搜索事件');
  }
};

/**
 * 获取事件详情
 * @param eventId 事件ID
 * @returns 事件详情数据
 * @throws ApiError 当API请求失败时
 */
export const getEventDetails = async (eventId: string): Promise<Event> => {
  try {
    const response = await apiClient.get(`/events/${eventId}`, {
      params: {
        apikey: API_CONFIG.API_KEY
      }
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, '获取事件详情');
  }
};