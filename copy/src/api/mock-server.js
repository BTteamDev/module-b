// --- НАША ФЕЙКОВАЯ БАЗА ДАННЫХ ---
let users = []; // Здесь будем "хранить" пользователей
let ads = [
  { id: 1, title: 'Продам велосипед', price: 15000 },
  { id: 2, title: 'Ищу репетитора по Vue', price: 1000 },
];
let nextAdId = 3;

// --- СИМУЛЯТОР WebSocket ---
// В реальном приложении это был бы настоящий WebSocket-сервер.
// Здесь мы просто создаем функцию, которую сможем вызывать, чтобы "отправить" сообщение всем клиентам.
let onNewAdCallback = null; // Переменная для хранения функции, которую нужно вызвать при появлении нового объявления

export const webSocketSimulator = {
  // Наш компонент вызовет эту функцию, чтобы "подписаться" на события
  connect: (callback) => {
    console.log('[WebSocket-симулятор]: Клиент подключился.');
    onNewAdCallback = callback;
  },
  // Наш компонент вызовет эту функцию при уходе со страницы
  disconnect: () => {
    console.log('[WebSocket-симулятор]: Клиент отключился.');
    onNewAdCallback = null;
  },
};

// --- ФУНКЦИИ, ИМИТИРУЮЩИЕ API (НАШ ОФИЦИАНТ) ---

// Функция регистрации
export const registerUser = (email, password) => {
  return new Promise((resolve, reject) => {
    // Имитируем задержку сети
    setTimeout(() => {
      // Проверяем, не занят ли email
      if (users.find((user) => user.email === email)) {
        // Если занят, возвращаем ошибку, как сделал бы реальный сервер
        reject({ message: 'Пользователь с таким email уже существует' });
      } else {
        // Если все ок, "сохраняем" пользователя
        users.push({ email, password });
        console.log('[API-симулятор]: Зарегистрирован новый пользователь:', { email });
        resolve({ message: 'Регистрация прошла успешно!' });
      }
    }, 1000); // Задержка 1 секунда
  });
};

// Функция входа
export const loginUser = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find((u) => u.email === email && u.password === password);
      if (user) {
        // Если пользователь найден, генерируем и возвращаем фейковый токен
        const fakeToken = 'secret-token-' + Math.random();
        console.log('[API-симулятор]: Пользователь вошел, выдан токен:', fakeToken);
        resolve({ token: fakeToken });
      } else {
        reject({ message: 'Неверный email или пароль' });
      }
    }, 1000);
  });
};

// Функция получения всех объявлений
export const fetchAds = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('[API-симулятор]: Отдаю список объявлений.');
      // Просто возвращаем наш массив объявлений
      resolve([...ads].reverse()); // Копируем и переворачиваем, чтобы новые были вверху
    }, 500); // Задержка 0.5 секунды
  });
};

// Функция создания нового объявления
export const createAd = (title, price, token) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // В реальном API мы бы проверили токен на валидность
      if (!token || !token.startsWith('secret-token-')) {
        return reject({ message: 'Ошибка авторизации' });
      }

      const newAd = { id: nextAdId++, title, price };
      ads.push(newAd);
      console.log('[API-симулятор]: Создано новое объявление:', newAd);

      // --- Магия WebSocket! ---
      // Если кто-то "слушает" наш WebSocket, отправляем ему новое объявление
      if (onNewAdCallback) {
        console.log('[WebSocket-симулятор]: Отправляю уведомление о новом объявлении.');
        onNewAdCallback(newAd);
      }

      resolve(newAd);
    }, 800);
  });
};