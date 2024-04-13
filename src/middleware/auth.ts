//Каждый запрос проходит через middleware. Он пробрасывает токен и слушает экшены

import { createListenerMiddleware } from "@reduxjs/toolkit"
import { userApi } from "../app/services/userApi"

export const listenerMiddleware = createListenerMiddleware()

listenerMiddleware.startListening({
    matcher: userApi.endpoints.login.matchFulfilled, //мы слушаем успешный ответ авторизации чтобы перехватить токен и записать его
    effect: async (action, listenerApi) => {
        listenerApi.cancelActiveListeners()

        if (action.payload.token) {
            localStorage.setItem("token", action.payload.token) //записываем токен
        }
    },
})