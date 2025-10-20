<template>
  <div id="app-wrapper">
    <nav>
      <!-- Ссылки, которые меняют URL без перезагрузки страницы -->
      <router-link to="/">Все объявления</router-link>
      <router-link v-if="!isLoggedIn" to="/login">Войти</router-link>
      <router-link v-if="!isLoggedIn" to="/register">Регистрация</router-link>
      <!-- Кнопка выхода, которая появляется только после логина -->
      <a href="#" v-if="isLoggedIn" @click.prevent="logout" class="logout-link">Выйти</a>
    </nav>

    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
// ... (вся логика из предыдущего ответа остается без изменений) ...
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoggedIn = ref(false);

const checkAuth = () => {
  const token = localStorage.getItem('authToken');
  isLoggedIn.value = !!token;
};

const logout = () => {
  localStorage.removeItem('authToken');
  checkAuth();
  router.push('/login');
};

onMounted(checkAuth);
watch(() => router.currentRoute.value, checkAuth);
</script>

<!-- 
  Здесь два блока стилей:
  1. Обычный <style> для глобальных правил (шрифт, отступы).
  2. <style scoped> для стилей, которые применяются только к этому компоненту (нашей навигации).
-->
<style>
/* Глобальные стили для всего приложения */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  margin: 0;
  background-color: #f4f7f6;
  color: #333;
}
#app-wrapper {
  max-width: 960px;
  margin: 0 auto;
  padding: 20px;
}
</style>

<style scoped>
/* Стили, которые применяются ТОЛЬКО к App.vue */
nav {
  background-color: #ffffff;
  padding: 15px 25px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  gap: 20px; /* Расстояние между ссылками */
  align-items: center;
  margin-bottom: 30px;
}

nav a {
  text-decoration: none;
  color: #2c3e50;
  font-weight: 500;
  transition: color 0.3s ease;
}

nav a:hover {
  color: #42b983; /* Фирменный цвет Vue :) */
}

/* Vue Router автоматически добавляет этот класс активной ссылке */
nav a.router-link-exact-active {
  color: #42b983;
  border-bottom: 2px solid #42b983;
  padding-bottom: 5px;
}

/* Ссылка "Выйти" будет справа */
.logout-link {
  margin-left: auto;
  color: #e74c3c;
}
.logout-link:hover {
  color: #c0392b;
}
</style>