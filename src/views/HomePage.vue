<template>
  <div class="home-page">
    <h1>事件列表</h1>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      加载中...
    </div>
    
    <!-- 事件列表 -->
    <div v-else-if="events.length > 0" class="event-list">
      <div 
        v-for="event in events" 
        :key="event.id" 
        class="event-card"
        @click="handleEventClick(event.id)"
      >
        <img 
          :src="event.images[0]?.url || ''" 
          :alt="event.name"
          class="event-image"
        />
        <div class="event-info">
          <h2 class="event-name">{{ event.name }}</h2>
          <p class="event-date">{{ formatDate(event.dates.start.localDate) }}</p>
          <p class="event-venue">{{ getVenueName(event) }}</p>
          <p class="event-category">{{ getCategory(event) }}</p>
        </div>
      </div>
    </div>
    
    <!-- 空状态 -->
    <div v-else class="empty-state">
      暂无事件数据
    </div>
    
    <!-- 分页控件 -->
    <div v-if="!loading && totalPages > 1" class="pagination">
      <button 
        @click="loadEvents(currentPage - 1)" 
        :disabled="currentPage === 1"
      >
        上一页
      </button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button 
        @click="loadEvents(currentPage + 1)" 
        :disabled="currentPage === totalPages"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { searchEvents } from '../services/api';
import type { Event } from '../types/event';

const router = useRouter();
const events = ref<Event[]>([]);
const loading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);

/**
 * 加载事件列表
 * @param page 页码
 */
const loadEvents = async (page: number) => {
  loading.value = true;
  try {
    const response = await searchEvents(page);
    events.value = response._embedded?.events || [];
    totalPages.value = response.page?.totalPages || 1;
    currentPage.value = page;
  } catch (error) {
    console.error('加载事件失败:', error);
  } finally {
    loading.value = false;
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
});
</script>

<style scoped>
.home-page {
  padding: 20px 0;
}

.loading {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
}

.empty-state {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #999;
}

.event-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.event-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;
}

.event-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.event-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.event-info {
  padding: 15px;
}

.event-name {
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #333;
}

.event-date,
.event-venue,
.event-category {
  margin: 5px 0;
  font-size: 14px;
  color: #666;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  gap: 15px;
}

.pagination button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

.pagination button:hover:not(:disabled) {
  background-color: #f0f0f0;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination span {
  font-size: 16px;
  color: #333;
}
</style>