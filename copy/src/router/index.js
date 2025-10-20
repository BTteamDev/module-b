import { createRouter, createWebHistory } from 'vue-router';

// Импортируем наши компоненты-страницы
import AdList from '@/components/AdList.vue';
import Login from '@/components/Login.vue';
import Register from '@/components/Register.vue';

// Создаем "карту" нашего сайта. Это массив правил "адрес -> компонент"
const routes = [
  {
    path: '/', // Если пользователь зашел на главный адрес сайта
    name: 'AdList',
    component: AdList, // Показываем ему компонент со списком объявлений
  },
  {
    path: '/login', // Если адрес /login
    name: 'Login',
    component: Login, // Показываем компонент входа
  },
  {
    path: '/register', // Если адрес /register
    name: 'Register',
    component: Register, // Показываем компонент регистрации
  },
];

// Создаем сам роутер на основе нашей "карты"
const router = createRouter({
  history: createWebHistory(), // Используем стандартный режим истории браузера
  routes, // передаем наши правила
});

// Экспортируем готовый роутер, чтобы его можно было подключить в main.js
export default router;