#Используем линукс alpine с node 19
FROM node:19.5.0-alpine AS build

#Указываем рабочую директорию
WORKDIR /app

#Скопируем package.json и package-lock.json внутрь контейнера /app
COPY package*.json ./

#Устанавливаем зависимости
RUN npm install

#Копируем оставшиеся приложения (Всё отсюда - туда, через 2 точки)
COPY . .

#Создаем папку build
RUN npm run build

#Копируем содержимое папки build в образ
RUN cp -r build /app_build

# Stage 2: Serve React Application with Nginx
FROM nginx:stable-alpine

#Копируем содержимое папки build из первого этапа сборки
COPY --from=build /app_build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8000

CMD ["nginx", "-g", "daemon off;"]