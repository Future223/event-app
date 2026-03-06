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
    
    <!-- 错误状态 -->
    <div v-else class="error-state">
      <h2>事件不存在或已被删除</h2>
      <button @click="goBack" class="back-button">
        返回列表
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getEventDetails } from '../services/api';
import type { Event } from '../types/event';

const router = useRouter();
const route = useRoute();
const event = ref<Event | null>(null);
const loading = ref(false);

/**
 * 加载事件详情
 */
const loadEventDetails = async () => {
  const eventId = route.params.id as string;
  if (!eventId) return;
  
  loading.value = true;
  try {
    const eventData = await getEventDetails(eventId);
    event.value = eventData;
  } catch (error) {
    console.error('加载事件详情失败:', error);
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
  padding: 20px 0;
}

.loading {
  text-align: center;
  padding: 60px;
  font-size: 18px;
  color: #666;
}

.error-state {
  text-align: center;
  padding: 60px;
}

.error-state h2 {
  color: #999;
  margin-bottom: 20px;
}

.back-button {
  padding: 10px 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-bottom: 20px;
}

.back-button:hover {
  background-color: #f0f0f0;
}

.event-title {
  margin: 0 0 20px 0;
  font-size: 24px;
  color: #333;
}

.event-header {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.event-image {
  width: 400px;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.event-meta {
  flex: 1;
  min-width: 300px;
}

.event-date,
.event-venue,
.event-category {
  margin: 10px 0;
  font-size: 16px;
  color: #666;
}

.event-date {
  font-weight: bold;
  color: #333;
}

.event-info {
  margin-top: 30px;
}

.ticket-link {
  display: inline-block;
  padding: 12px 24px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.ticket-link:hover {
  background-color: #0069d9;
}

@media (max-width: 768px) {
  .event-header {
    flex-direction: column;
  }
  
  .event-image {
    width: 100%;
    height: 200px;
  }
}
</style>