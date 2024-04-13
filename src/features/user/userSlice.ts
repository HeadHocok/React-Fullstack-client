import {User} from "../../app/types";
import {createSlice} from "@reduxjs/toolkit";
import {userApi} from "../../app/services/userApi";
import {RootState} from "../../app/store";

interface InitialState {
    user: User | null;
    isAuthenticated: boolean;
    users: User[] | null;
    current: User | null;
    token?: string;
}

const initialState: InitialState = {
    user: null,
    isAuthenticated: false,
    users: null,
    current: null,
}

const slice = createSlice({
    name: 'user',
    initialState, //state пользователя хранится здесь
    reducers: { //когда происходит logout - мы присваиваем верхнему стейту - объект const initialState (обнулям пользователя)
        logout: () => initialState,
        resetUser: (state) => {
            state.user = null; //меняем напрямую. В Redux так делать НЕЛЬЗЯ, но в redux toolkit это безопасно
        }
    },
    extraReducers: (builder) => {
        builder
            //когда экшен login завершился успешно - тогда запустится эта функция
            .addMatcher(userApi.endpoints.login.matchFulfilled, (state, action) => {
                state.token = action.payload.token
                state.isAuthenticated = true
            })
            //когда экшен current завершился успешно
            .addMatcher(userApi.endpoints.current.matchFulfilled, (state, action) => {
                state.isAuthenticated = true
                state.current = action.payload
            })
            //когда экшен getUserById завершился успешно
            .addMatcher(
                userApi.endpoints.getUserById.matchFulfilled,
                (state, action) => {
                    state.user = action.payload
                },
            )
    },
})

export const { logout, resetUser } = slice.actions;
export default slice.reducer;

//чтобы выбирать какие-то значения из нашего стейта - пишем нижние экспорты
export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated;

export const selectCurrent = (state: RootState) => state.user.current;

export const selectUsers = (state: RootState) => state.user.users;

export const selectUser = (state: RootState) => state.user.user;