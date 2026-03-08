<template>
  <div class="app">
    <router-view />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  --accent-color: #9b59b6;
  --dark-color: #2c3e50;
  --light-color: #ecf0f1;
  --text-color: #333;
  --card-bg: rgba(255, 255, 255, 0.9);
  --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-hover: 0 10px 20px rgba(0, 0, 0, 0.15);
  --border-radius: 12px;
  --transition: all 0.3s ease;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  min-height: 100vh;
  color: var(--text-color);
  overflow-x: hidden;
}

.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
}

/* 添加科技感装饰元素 */
.app::before {
  content: '';
  position: absolute;
  top: 0;
  left: -50%;
  width: 200%;
  height: 100px;
  background: linear-gradient(90deg, transparent, rgba(52, 152, 219, 0.1), transparent);
  animation: scan 8s linear infinite;
  z-index: -1;
}

@keyframes scan {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>