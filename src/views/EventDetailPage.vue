<template>
  <div class="event-detail">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      加载中...
    </div>
    
    <!-- 事件详情 -->
    <div v-else-if="event" class="event-content">
      <button @click="goBack" class="back-button">
        ← 返回列表
      </button>
      
      <h1 class="event-title">{{ event.name }}</h1>
      
      <div class="event-header">
        <img 
          :src="event.images[0]?.url || ''" 
          :alt="event.name"
          class="event-image"
        />
        <div class="event-meta">
          <p class="event-date">{{ formatDate(event.dates.start.localDate) }} {{ event.dates.start.localTime }}</p>
          <p class="event-venue">{{ getVenueName(event) }}</p>
          <p class="event-category">{{ getCategory(event) }}</p>
        </div>
      </div>
      
      <div class="event-info">
        <a :href="event.url" target="_blank" class="ticket-link">
          查看票务信息
        </a>
      </div>
    </div>
    
    <!-- 错误提示 -->
    <div v-if="error" class="error-toast">
      <span>{{ error }}</span>
      <button @click="error = null" class="close-button">×</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getEventDetails, ApiError } from '../services/api';
import type { Event } from '../types/event';

const router = useRouter();
const route = useRoute();
const event = ref<Event | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

/**
 * 加载事件详情
 */
const loadEventDetails = async () => {
  const eventId = route.params.id as string;
  if (!eventId) {
    error.value = '事件ID无效';
    return;
  }
  
  loading.value = true;
  error.value = null;
  
  try {
    const eventData = await getEventDetails(eventId);
    event.value = eventData;
  } catch (err) {
    if (err instanceof ApiError) {
      error.value = `API错误: ${err.message}`;
      console.error('加载事件详情失败:', err.message);
    } else {
      error.value = '加载失败，请稍后重试';
      console.error('加载事件详情失败:', err);
    }
  } finally {
    loading.value = false;
  }
};

/**
 * 返回上一页
 */
const goBack = () => {
  router.push('/');
};

/**
 * 格式化日期
 * @param dateString 日期字符串
 * @returns 格式化后的日期
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
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

// 组件挂载时加载事件详情
onMounted(() => {
  loadEventDetails();
});
</script>

<style scoped>
.event-detail {
  padding: 40px 0;
  position: relative;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  color: rgba(255, 255, 255, 0.8);
}

.loading::before {
  content: '';
  width: 50px;
  height: 50px;
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

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  color: rgba(255, 255, 255, 0.8);
}

.error-state h2 {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 20px;
  font-size: 1.5rem;
  font-weight: 600;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: 1px solid rgba(52, 152, 219, 0.3);
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 30px;
  font-weight: 500;
}

.back-button:hover {
  background: rgba(52, 152, 219, 0.2);
  border-color: var(--primary-color);
  transform: translateY(-2px);
}

.event-title {
  margin: 0 0 30px 0;
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 0 20px rgba(52, 152, 219, 0.5);
  background: linear-gradient(45deg, #3498db, #2ecc71);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.event-header {
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
  flex-wrap: wrap;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.event-image {
  width: 400px;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.event-image:hover {
  transform: scale(1.02);
}

.event-meta {
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.event-date,
.event-venue,
.event-category {
  margin: 12px 0;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;
}

.event-date {
  font-weight: 600;
  color: #3498db;
  font-size: 18px;
}

.event-venue {
  color: rgba(255, 255, 255, 0.9);
}

.event-category {
  background: rgba(46, 204, 113, 0.1);
  color: var(--secondary-color);
  padding: 6px 16px;
  border-radius: 20px;
  align-self: flex-start;
  font-weight: 500;
  font-size: 14px;
}

.event-info {
  margin-top: 40px;
}

.ticket-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: linear-gradient(45deg, #3498db, #2ecc71);
  color: white;
  text-decoration: none;
  border-radius: 30px;
  transition: all 0.3s ease;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.ticket-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(52, 152, 219, 0.4);
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

@media (max-width: 1024px) {
  .event-header {
    gap: 20px;
    padding: 15px;
  }
  
  .event-image {
    width: 350px;
    height: 250px;
  }
  
  .event-title {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .event-detail {
    padding: 20px 0;
  }
  
  .event-header {
    flex-direction: column;
  }
  
  .event-image {
    width: 100%;
    height: 200px;
  }
  
  .event-title {
    font-size: 1.8rem;
    margin-bottom: 20px;
  }
  
  .back-button {
    padding: 10px 20px;
    margin-bottom: 20px;
  }
  
  .event-meta {
    min-width: 100%;
  }
  
  .event-date,
  .event-venue,
  .event-category {
    margin: 8px 0;
  }
}

@media (max-width: 480px) {
  .event-title {
    font-size: 1.5rem;
  }
  
  .event-header {
    padding: 12px;
  }
  
  .event-image {
    height: 180px;
  }
  
  .ticket-link {
    padding: 12px 24px;
    font-size: 14px;
  }
}
</style>