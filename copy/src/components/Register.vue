<template>
  <div class="form-container"> <!-- Обертка -->
    <h2>Регистрация</h2>
    <form @submit.prevent="handleRegister">
      <div class="form-group"> <!-- Группа для label + input -->
        <label for="email">Email:</label>
        <input type="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="password">Пароль:</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit" :disabled="isLoading">Зарегистрироваться</button>
    </form>
    <p v-if="isLoading" class="message">Идет регистрация...</p>
    <p v-if="error" class="message error">{{ error }}</p>
    <p v-if="success" class="message success">{{ success }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// Импортируем нашу фейковую API-функцию
import { registerUser } from '../api/mock-server';

const router = useRouter();

// Создаем реактивные переменные для хранения данных из полей ввода
const email = ref('');
const password = ref('');
// Переменные для отслеживания состояния (загрузка, ошибка, успех)
const isLoading = ref(false);
const error = ref(null);
const success = ref(null);

// Асинхронная функция, которая вызывается при отправке формы
const handleRegister = async () => {
  isLoading.value = true;
  error.value = null;
  success.value = null;

  try {
    // Вызываем нашу API-функцию и ЖДЕМ ее выполнения
    const response = await registerUser(email.value, password.value);
    success.value = response.message;
    // Если все успешно, через 2 секунды перенаправляем на страницу входа
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  } catch (err) {
    // Если API вернуло ошибку, мы ее "ловим" здесь
    error.value = err.message;
  } finally {
    // Этот блок выполнится в любом случае: и при успехе, и при ошибке
    isLoading.value = false;
  }
};
</script>

<style scoped>
.form-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

h2 {
  text-align: center;
  margin-bottom: 25px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #555;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box; /* Чтобы padding не влиял на ширину */
  transition: border-color 0.3s ease;
}

input:focus {
  outline: none;
  border-color: #42b983;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #36a46f;
}

/* Стиль для неактивной кнопки (во время загрузки) */
button:disabled {
  background-color: #a5d6b8;
  cursor: not-allowed;
}

/* Стили для сообщений об ошибках и успехе */
.message {
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
}
.error {
  color: #e74c3c;
}
.success {
  color: #2ecc71;
}
</style>