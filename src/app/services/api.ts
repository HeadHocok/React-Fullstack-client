import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../constants";
import { RootState } from "../store";

const baseQuery = fetchBaseQuery({ //Указывается базовый URL для всех запросов. Добавляет заголовок авторизации с токеном
    baseUrl: `${BASE_URL}/api`,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).user.token || localStorage.getItem("token");

        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }

        return headers;
    }
})

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 1 })

export const api = createApi({ //автоматически создает редюсеры.
    reducerPath: 'splitApi', //Указывается путь для редюсера. Все api будут в разных файлах
    baseQuery: baseQueryWithRetry, //запрос на авторизацию вместе с повторным запросом при неудаче
    refetchOnMountOrArgChange: true, //если страница меняется - он будет перезапрашивать. Предотвращает использование кеша.
    endpoints: () => ({})
})