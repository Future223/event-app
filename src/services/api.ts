import axios from 'axios';
import type { Event, EventResponse } from '../types/event';

// Ticketmaster API密钥
const API_KEY = 'AJIubp2Y9E8NY4rBrYmVt2nJqHjghF8S';
// API基础URL
const BASE_URL = 'https://app.ticketmaster.com/discovery/v2';

/**
 * 搜索事件列表
 * @param page 页码，默认1
 * @param pageSize 每页数量，默认20
 * @returns 事件列表响应数据
 */
export const searchEvents = async (page: number = 1, pageSize: number = 20): Promise<EventResponse> => {
  try {
    const response = await axios.get(`${BASE_URL}/events`, {
      params: {
        apikey: API_KEY,
        page,
        size: pageSize,
        countryCode: 'US' // 限制为美国事件
      }
    });
    return response.data;
  } catch (error) {
    console.error('搜索事件失败:', error);
    return {};
  }
};

/**
 * 获取事件详情
 * @param eventId 事件ID
 * @returns 事件详情数据
 */
export const getEventDetails = async (eventId: string): Promise<Event | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/events/${eventId}`, {
      params: {
        apikey: API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error('获取事件详情失败:', error);
    return null;
  }
};