import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import EventDetailPage from '../views/EventDetailPage.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/event/:id',
      name: 'event-detail',
      component: EventDetailPage,
      props: true
    }
  ]
});

export default router;