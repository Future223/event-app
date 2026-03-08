/**
 * 事件日期信息接口
 */
export interface EventDate {
  start: {
    localDate: string;
    localTime?: string;
  };
}

/**
 * 事件图片接口
 */
export interface EventImage {
  url: string;
  width: number;
  height: number;
}

/**
 * 城市信息接口
 */
export interface City {
  name: string;
}

/**
 * 州信息接口
 */
export interface State {
  name: string;
}

/**
 * 场馆信息接口
 */
export interface Venue {
  name: string;
  city: City;
  state?: State;
}

/**
 * 分类信息接口
 */
export interface Classification {
  segment?: {
    name: string;
  };
}

/**
 * 嵌入式数据接口
 */
export interface EventEmbedded {
  venues?: Venue[];
}

/**
 * 分页信息接口
 */
export interface PageInfo {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}

/**
 * 事件接口
 */
export interface Event {
  id: string;
  name: string;
  url: string;
  dates: EventDate;
  images: EventImage[];
  _embedded?: EventEmbedded;
  classifications?: Classification[];
}

/**
 * 事件列表响应接口
 */
export interface EventResponse {
  _embedded?: {
    events: Event[];
  };
  page?: PageInfo;
}