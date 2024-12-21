# Введение

Приложение предназначено для управления через HTTP методы типа GET и POST. Был использован фреймворк Express, подробная информация о его функциональности доступна в [документации Express](http://expressjs.com/).

## Запуск приложения

Для установки всех зависимостей вам нужно выполнить следующую команду:

```bash
npm install
```

Запуск приложения (в соответствии с вашими настройками скриптов в `package.json`):

```bash
npm start
```

## Используемые методы

В приложении реализованы следующие точки подключения:

- '/register' [POST]: для регистрации новых пользователей.
- '/login' [POST]: для входа в систему зарегистрированных пользователей.
- '/chats' [GET]: для получения всех чатов.
- '/chats' [POST]: для отправки сообщений в чат.

## Тестирование API в Swagger

Для тестирования API в Swagger нужно перейти по ссылке [http://localhost:3001/api-docs](http://localhost:3001/api-docs).

Авторизация делается следующим образом:

1. Зарегистрируйтесь, используя точку подключения '/register'. Предоставьте имя пользователя и пароль в теле запроса в формате JSON: {"username": "your_username", "password": "your_password"}.
2. Войдите в систему, используя точку подключения '/login'. Предоставьте имя пользователя и пароль того же пользователя, которого вы зарегистрировали.
3. После успешного входа в систему в ответе будет токен. Скопируйте этот токен.
4. Нажмите кнопку "Authorize" в верхнем правом углу Swagger UI, введите "Bearer " и после пробела вставьте скопированный токен. Нажмите "Authorize" для отправки токена.
5. Теперь вы можете использовать точки подключения '/chats', передавая Bearer токен в заголовке Authorization.

Примечание: Если вы не вошли в систему или вошли в систему, но токен истёк, запросы к '/chats' вернут ошибку 401 или 403.

## Изменение порта приложения

Порт сервера по умолчанию установлен как `3001`, но это значение может быть изменено в разделе вашего программного кода, где выполняется функция `getPort()`. В этой функции вы можете передать значение порта в качестве аргумента, и это значение будет использоваться приложением.

```javascript
app.listen(getPort(3005), () => {
    console.log(`Server started at http://localhost:${getPort(3005)}`);
});
```

В приведенном выше примере приложение будет доступно по адресу [http://localhost:3005/api-docs](http://localhost:3005/api-docs).

## Заключение

Этот пример используется исключительно для обучения. Реальная система должна содержать больше проверок безопасности и валидацию данных.