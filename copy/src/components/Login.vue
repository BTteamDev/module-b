<template>
  <!-- НОВОЕ: общая обертка для центрирования -->
  <div class="login-page">
    <div class="form-container">
      <h2>Вход в систему</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email:</label>
          <input id="email" type="email" v-model="email" required placeholder="example@mail.com" />
        </div>
        <div class="form-group">
          <label for="password">Пароль:</label>
          <input id="password" type="password" v-model="password" required placeholder="••••••••" />
        </div>
        <!-- НОВОЕ: обертка для сообщений -->
        <div class="message-wrapper">
            <p v-if="isLoading" class="message">Выполняется вход...</p>
            <p v-if="error" class="message error">{{ error }}</p>
        </div>
        <button type="submit" :disabled="isLoading">
          <!-- НОВОЕ: меняем текст на кнопке во время загрузки -->
          {{ isLoading ? 'Вход...' : 'Войти' }}
        </button>
      </form>
      <!-- НОВОЕ: ссылка для перехода на регистрацию -->
      <div class="form-footer">
        <p>Нет аккаунта? <router-link to="/register">Зарегистрируйтесь</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
// ... (скрипт остается без изменений) ...
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { loginUser } from '../api/mock-server';

const router = useRouter();
const email = ref('');
const password = ref('');
const isLoading = ref(false);
const error = ref(null);

const handleLogin = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await loginUser(email.value, password.value);
    localStorage.setItem('authToken', response.token);
    router.push('/');
  } catch (err) {
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* НОВОЕ: центрирование всей страницы */
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 150px); /* Высота экрана минус примерная высота шапки и отступов */
}

.form-container {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  border: 1px solid #e0e0e0;
}

h2 {
  text-align: center;
  margin-bottom: 25px;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #555;
}

input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-sizing: border-box;
  font-size: 16px;
  transition: all 0.3s ease;
}

/* НОВОЕ: улучшенный фокус */
input:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.2);
}

/* НОВОЕ: обертка для сообщений, чтобы кнопка не прыгала */
.message-wrapper {
  min-height: 20px;
  margin-bottom: 15px;
}
.message {
  text-align: center;
  font-size: 14px;
}
.error {
  color: #e74c3c;
  background-color: #fbecec;
  padding: 8px;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 14px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

button:hover:not(:disabled) {
  background-color: #36a46f;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

button:disabled {
  background-color: #a5d6b8;
  cursor: not-allowed;
}

/* НОВОЕ: стили для подвала формы */
.form-footer {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #666;
}

.form-footer a {
  color: #42b983;
  text-decoration: none;
  font-weight: 600;
}

.form-footer a:hover {
  text-decoration: underline;
}
</style>