import type { Action, ThunkAction } from "@reduxjs/toolkit"
import { combineSlices, configureStore } from "@reduxjs/toolkit"
import { api } from "./services/api";
import user from '../features/user/userSlice'
import {listenerMiddleware} from "../middleware/auth";

export const store = configureStore({ //хранилище
  reducer: {
    [api.reducerPath]: api.reducer, //определим редьюсер для всего, что есть в api
    user,
  },
  middleware: (getDefaultMiddleware) => { //регистрируем middleware
    return getDefaultMiddleware()
        .concat(api.middleware)
        .prepend(listenerMiddleware.middleware);
  }
})

export type AppStore = typeof store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = AppStore["dispatch"]
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>
