<template>
  <div>
    <h2>Список объявлений</h2>

    <!-- Форма для создания нового объявления -->
    <!-- Мы показываем ее ТОЛЬКО если пользователь залогинен -->
    <div v-if="isLoggedIn" class="create-ad-form">
      <h3>Создать новое объявление</h3>
      <form @submit.prevent="handleCreateAd" class="form-inline">
        <input v-model="newAdTitle" placeholder="Название" required />
        <input type="number" v-model="newAdPrice" placeholder="Цена" required />
        <button type="submit">Добавить</button>
      </form>
    </div>

    <!-- Сообщения о состоянии загрузки или ошибках -->
    <div v-if="isLoading" class="loader-container">
      <div class="loader"></div>
    </div>
    <div v-if="error" style="color: red;">{{ error }}</div>

    <div v-else-if="ads.length === 0" class="empty-state">
      <h3>Объявлений пока нет</h3>
      <p>Станьте первым, кто добавит объявление!</p>
    </div>

    <!-- Сам список объявлений 
    <ul v-else>
       Пробегаемся по массиву ads и для каждого элемента рисуем <li> 
      <li v-for="ad in ads" :key="ad.id">
        <strong>{{ ad.title }}</strong> - {{ ad.price }} руб.
      </li>
    </ul>-->
        <div v-else class="grid">
            <article v-for="ad in ads" :key="ad.id">
                <div class="ads-container">
                    <h4>Объявление №{{ ad.id }}</h4>
                    <div class="ads-container__wrapper">
                        <span style="font-size: 20px; font-weight: 640;">{{ ad.title }}</span>
                        <span style="margin: 12px; font-size: 14px;">{{ ad.price.toLocaleString('ru-RU') }} руб.</span>
                        <button>Откликнуться</button>
                    </div>
                </div>
            </article>
        </div>
    </div>

    <div class="ws-status">
      Статус WebSocket: {{ wsStatus }}
    </div>
</template>

<style scoped>
/* Добавим немного стилей для наглядности */
.create-ad-form {
  background-color: #f0f0f0;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 5px;
}
</style>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { fetchAds, createAd, webSocketSimulator } from '../api/mock-server';

// Реактивные переменные для хранения списка, состояния загрузки и ошибок
const ads = ref([]);
const isLoading = ref(true);
const error = ref(null);
const wsStatus = ref('Отключен');

// Переменные для полей ввода новой формы
const newAdTitle = ref('');
const newAdPrice = ref('');

// Вычисляемое свойство. Оно автоматически следит за localStorage.
// Это самый простой способ проверить, есть ли токен, без сложных систем.
const isLoggedIn = computed(() => {
  return !!localStorage.getItem('authToken');
});

// Функция для загрузки объявлений с нашего "сервера"
const loadAds = async () => {
  try {
    isLoading.value = true;
    ads.value = await fetchAds();
  } catch (err) {
    error.value = 'Не удалось загрузить объявления';
  } finally {
    isLoading.value = false;
  }
};

// Функция для создания нового объявления
const handleCreateAd = async () => {
  // Достаем "пропуск" из кармана
  const token = localStorage.getItem('authToken');
  if (!token) {
    alert('Пожалуйста, войдите в систему, чтобы добавлять объявления.');
    return;
  }
  
  try {
    // Отправляем данные на "сервер".
    // ВАЖНО: мы НЕ добавляем результат в `ads.value` вручную.
    // За нас это сделает WebSocket! Мы просто отправляем команду на сервер.
    await createAd(newAdTitle.value, newAdPrice.value, token);
    
    // Очищаем поля формы после успешной отправки
    newAdTitle.value = '';
    newAdPrice.value = '';
  } catch (err) {
    alert(err.message);
  }
};

// --- Жизненный цикл компонента ---

// onMounted вызывается ОДИН РАЗ, когда компонент появился на экране
onMounted(() => {
  // 1. Сразу же загружаем первоначальный список объявлений
  loadAds();

  // 2. "Включаем рацию" - подключаемся к нашему симулятору WebSocket
  webSocketSimulator.connect((newAdFromServer) => {
    // Эта функция-колбэк будет вызвана КАЖДЫЙ РАЗ, когда "сервер"
    // пришлет нам новое объявление по "рации".
    console.log('Получено новое объявление через WebSocket!', newAdFromServer);
    // Добавляем новое объявление в НАЧАЛО нашего списка
    ads.value.unshift(newAdFromServer);
  });
  wsStatus.value = 'Подключен и слушает...';
});

// onUnmounted вызывается ОДИН РАЗ, когда компонент уходит с экрана (например, при переходе на /login)
onUnmounted(() => {
  // "Выключаем рацию", чтобы не слушать эфир зря и не создавать утечек памяти.
  // Это ОЧЕНЬ важный шаг в реальных приложениях.
  webSocketSimulator.disconnect();
  wsStatus.value = 'Отключен';
});
</script>

<style scoped>
.grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    align-items: center;
}
article {
    background-color: #ffffff;
    padding: 20px;
    margin-bottom: 30px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    max-width: 161px;
    padding-top: 1px;
}
/* Стили остаются без изменений */
.create-ad-form { background-color: #ffffff; padding: 20px; margin-bottom: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.form-inline { display: flex; gap: 10px; }
.form-inline input { flex-grow: 1; padding: 10px; border: 1px solid #ccc; border-radius: 4px; }
.form-inline button { padding: 10px 20px; background-color: #42b983; color: white; border: none; border-radius: 4px; cursor: pointer; }
article button {
    padding: 10px 20px;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.ads-container__wrapper {
    display: flex;
    flex-direction: column;
}

/* Стили для списка объявлений */
.ads-list {
  list-style-type: none;
  padding: 0;
}

.ad-item {
  background-color: #ffffff;
  padding: 15px 20px;
  margin-bottom: 12px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-left: 5px solid #42b983;
}

.ad-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.ad-content {
  display: flex;
  flex-direction: column;
}

.ad-title {
  font-weight: 600;
  font-size: 18px;
  color: #2c3e50;
}

.ad-price {
  font-weight: bold;
  font-size: 18px;
  color: #333;
  white-space: nowrap;
  margin-left: 20px;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.loader-container {
  display: flex;
  justify-content: center;
  padding: 40px;
}
.loader {
  border: 5px solid #f3f3f3;
  border-top: 5px solid #42b983;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  margin-top: 50px;
  padding: 30px;
  background-color: #fafafa;
  border-radius: 8px;
}
.empty-state h3 {
  color: #333;
}
.empty-state p {
  color: #777;
}

.ws-status { margin-top: 20px; font-size: 12px; color: #888; text-align: center; }
.message.error { color: #e74c3c; text-align: center; background-color: #fbecec; padding: 10px; border-radius: 5px; }
</style>