<template>
  <div class="home-page" @scroll="handleScroll">
    <h1 class="page-title">
      <span class="title-text">事件列表</span>
      <span class="title-glow"></span>
    </h1>
    
    <!-- 加载状态 -->
    <div v-if="loading && events.length === 0" class="loading">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>
    
    <!-- 错误提示 -->
    <div v-if="error" class="error-toast">
      <span>{{ error }}</span>
      <button @click="error = null" class="close-button">×</button>
    </div>
    
    <!-- 事件列表 -->
    <div v-else-if="events.length > 0" class="event-list">
      <div 
        v-for="event in events" 
        :key="event.id" 
        class="event-card"
        @click="handleEventClick(event.id)"
      >
        <div class="event-image-container">
          <img 
            :src="event.images[0]?.url || ''" 
            :alt="event.name"
            class="event-image"
          />
          <div class="image-overlay"></div>
        </div>
        <div class="event-info">
          <h2 class="event-name">{{ event.name }}</h2>
          <div class="event-meta">
            <span class="meta-item date">{{ formatDate(event.dates.start.localDate) }}</span>
            <span class="meta-divider">•</span>
            <span class="meta-item category">{{ getCategory(event) }}</span>
          </div>
          <p class="event-venue">{{ getVenueName(event) }}</p>
        </div>
        <div class="card-glow"></div>
      </div>
    </div>
    
    <!-- 加载更多指示器 -->
    <div v-if="loadingMore" class="loading-more">
      <div class="loading-container">
        <div class="loading-spinner small"></div>
        <div class="loading-text">
          <span>加载更多</span>
          <span class="ellipsis">...</span>
        </div>
      </div>
    </div>
    
    <!-- 无更多数据提示 -->
    <div v-if="!loadingMore && !hasMoreData" class="no-more-data">
      <p>已加载全部数据</p>
    </div>
    
    <!-- 空状态 -->
    <div v-if="!loadingMore && !loading && events.length === 0" class="empty-state">
      <div class="empty-icon">📅</div>
      <p>暂无事件数据</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { searchEvents, ApiError } from '../services/api';
import type { Event } from '../types/event';

const router = useRouter();
const events = ref<Event[]>([]);
const loading = ref(false);
const loadingMore = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const hasMoreData = ref(true);
const error = ref<string | null>(null);

/**
 * 加载事件列表
 * @param page 页码
 * @param append 是否追加数据
 */
const loadEvents = async (page: number, append: boolean = false) => {
  // 如果是加载更多且已经没有更多数据，则直接返回
  if (append && !hasMoreData.value) {
    return;
  }
  
  // 重置错误状态
  error.value = null;
  
  // 设置加载状态
  if (append) {
    loadingMore.value = true;
  } else {
    loading.value = true;
  }
  
  try {
    const response = await searchEvents(page);
    const newEvents = response._embedded?.events || [];
    
    // 更新数据
    if (append) {
      events.value = [...events.value, ...newEvents];
    } else {
      events.value = newEvents;
    }
    
    // 更新分页信息
    totalPages.value = response.page?.totalPages || 1;
    currentPage.value = page;
    
    // 检查是否还有更多数据
    hasMoreData.value = page < totalPages.value;
  } catch (err) {
    if (err instanceof ApiError) {
      error.value = `API错误: ${err.message}`;
      console.error('加载事件失败:', err.message);
    } else {
      error.value = '加载失败，请稍后重试';
      console.error('加载事件失败:', err);
    }
  } finally {
    // 重置加载状态
    loading.value = false;
    loadingMore.value = false;
  }
};

/**
 * 处理滚动事件，实现无限加载
 */
const handleScroll = () => {
  // 使用window滚动事件，更准确地检测页面滚动位置
  const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
  
  // 当滚动到距离底部200px时加载更多（更接近底部）
  if (scrollTop + clientHeight >= scrollHeight - 200 && !loadingMore.value && hasMoreData.value) {
    loadEvents(currentPage.value + 1, true);
  }
};

/**
 * 处理事件点击，跳转到详情页
 * @param eventId 事件ID
 */
const handleEventClick = (eventId: string) => {
  router.push(`/event/${eventId}`);
};

/**
 * 格式化日期
 * @param dateString 日期字符串
 * @returns 格式化后的日期
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN');
};

/**
 * 获取场馆名称
 * @param event 事件对象
 * @returns 场馆名称
 */
const getVenueName = (event: Event): string => {
  if (event._embedded?.venues?.[0]) {
    const venue = event._embedded.venues[0];
    return `${venue.name}, ${venue.city.name}${venue.state ? `, ${venue.state.name}` : ''}`;
  }
  return '未知场馆';
};

/**
 * 获取事件分类
 * @param event 事件对象
 * @returns 事件分类
 */
const getCategory = (event: Event): string => {
  if (event.classifications?.[0]?.segment) {
    return event.classifications[0].segment.name;
  }
  return '未分类';
};

// 组件挂载时加载第一页数据
onMounted(() => {
  loadEvents(1);
  
  // 监听窗口滚动事件（如果home-page不是固定高度）
  window.addEventListener('scroll', handleScroll);
});

// 组件卸载时移除事件监听器
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.home-page {
  padding: 40px 0;
  position: relative;
}

/* 页面标题 */
.page-title {
  position: relative;
  text-align: center;
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 40px;
  color: #fff;
  text-shadow: 0 0 20px rgba(52, 152, 219, 0.5);
  display: inline-block;
  left: 50%;
  transform: translateX(-50%);
}

.title-text {
  position: relative;
  z-index: 2;
  background: linear-gradient(45deg, #3498db, #2ecc71);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, #3498db, #2ecc71);
  filter: blur(20px);
  opacity: 0.3;
  z-index: 1;
  animation: titlePulse 3s ease-in-out infinite alternate;
}

@keyframes titlePulse {
  0% {
    transform: scale(1);
    opacity: 0.3;
  }
  100% {
    transform: scale(1.05);
    opacity: 0.5;
  }
}

/* 加载状态 */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  color: #fff;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(52, 152, 219, 0.3);
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading p {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
}

/* 事件列表 */
.event-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
  margin: 30px 0;
}

/* 事件卡片 */
.event-card {
  position: relative;
  background: var(--card-bg);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  cursor: pointer;
  transition: var(--transition);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.event-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: var(--shadow-hover);
}

.event-card:hover .card-glow {
  opacity: 1;
  transform: scale(1.05);
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(52, 152, 219, 0.2), rgba(46, 204, 113, 0.2));
  opacity: 0;
  transition: var(--transition);
  z-index: 1;
  pointer-events: none;
}

/* 事件图片 */
.event-image-container {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.event-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition);
}

.event-card:hover .event-image {
  transform: scale(1.1);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  z-index: 2;
}

/* 事件信息 */
.event-info {
  position: relative;
  padding: 20px;
  z-index: 3;
}

.event-name {
  margin: 0 0 15px 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--dark-color);
  line-height: 1.4;
  transition: var(--transition);
}

.event-card:hover .event-name {
  color: var(--primary-color);
}

/* 事件元数据 */
.event-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 0.9rem;
}

.meta-item {
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 500;
}

.meta-item.date {
  background: rgba(52, 152, 219, 0.1);
  color: var(--primary-color);
}

.meta-item.category {
  background: rgba(46, 204, 113, 0.1);
  color: var(--secondary-color);
}

.meta-divider {
  color: #999;
  font-weight: 300;
}

.event-venue {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 0;
  color: rgba(255, 255, 255, 0.6);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.6;
}

.empty-state p {
  font-size: 1.2rem;
  font-weight: 400;
}

/* 分页控件 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
  gap: 20px;
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: 1px solid rgba(52, 152, 219, 0.3);
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  cursor: pointer;
  transition: var(--transition);
  font-weight: 500;
}

.pagination-btn:hover:not(:disabled) {
  background: rgba(52, 152, 219, 0.2);
  border-color: var(--primary-color);
  transform: translateY(-2px);
}

.pagination-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  transform: none;
}

.btn-icon {
  font-size: 1rem;
  font-weight: bold;
}

.pagination-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 30px;
  color: #fff;
  font-weight: 500;
}

.current-page {
  color: var(--primary-color);
  font-weight: 700;
}

.page-separator {
  color: rgba(255, 255, 255, 0.5);
}

.total-pages {
  color: rgba(255, 255, 255, 0.8);
}

/* 加载更多指示器 */
.loading-more {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
  color: rgba(255, 255, 255, 0.8);
}

.loading-container {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 30px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(52, 152, 219, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.loading-container:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(52, 152, 219, 0.3);
  transform: translateY(-2px);
}

.loading-spinner.small {
  width: 30px;
  height: 30px;
  border-width: 2px;
  margin: 0;
}

.loading-text {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

.ellipsis {
  display: inline-block;
  animation: ellipsis 1.5s infinite;
}

@keyframes ellipsis {
  0%, 20% {
    content: '.';
  }
  40% {
    content: '..';
  }
  60%, 100% {
    content: '...';
  }
}

/* 无更多数据提示 */
.no-more-data {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
  color: rgba(255, 255, 255, 0.6);
}

.no-more-data p {
  font-size: 16px;
  font-weight: 400;
}

/* 错误提示 */
.error-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(231, 76, 60, 0.9);
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

.error-toast span {
  flex: 1;
  font-size: 14px;
  line-height: 1.4;
}

.close-button {
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .event-list {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 25px;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .home-page {
    padding: 20px 0;
  }
  
  .event-list {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .event-image-container {
    height: 180px;
  }
  
  .event-info {
    padding: 15px;
  }
  
  .event-name {
    font-size: 1.1rem;
    margin-bottom: 10px;
  }
  
  .event-meta {
    font-size: 0.8rem;
  }
  
  .meta-item {
    padding: 3px 10px;
  }
  
  .loading {
    padding: 60px 0;
  }
  
  .loading-spinner {
    width: 50px;
    height: 50px;
  }
  
  .loading-more {
    padding: 30px 0;
  }
  
  .no-more-data {
    padding: 30px 0;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.8rem;
  }
  
  .event-image-container {
    height: 160px;
  }
  
  .event-info {
    padding: 12px;
  }
  
  .event-name {
    font-size: 1rem;
  }
  
  .loading {
    padding: 40px 0;
  }
  
  .loading-spinner {
    width: 40px;
    height: 40px;
  }
}
</style>