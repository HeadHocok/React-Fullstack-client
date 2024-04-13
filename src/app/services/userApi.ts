import { api } from "./api";
import { User } from "../types"

export const userApi = api.injectEndpoints({ //интегрируем эндпоинты
    endpoints: (builder) => ({
        // Определение метода для выполнения входа пользователя
        login: builder.mutation< //присваивается функция builder.mutation. Внутрь прокидываются типы ниже. (ts)
            { token: string }, //то, что возвращает
            { email: string; password: string } //то, что принимает
        >({ //в builder.mutation передается объект userData ({ email: string; password: string }), в котором функция query также возвращает объект { token: string }
            query: (userData) => ({
                url: '/login',
                method: 'POST',
                body: userData
            }),
        }),
        // Определение метода для регистрации нового пользователя
        register: builder.mutation<
            { email: string; password: string; name: string },
            { email: string; password: string; name: string }
        >({
            query: (userData) => ({
                url: '/register',
                method: 'POST',
                body: userData
            }),
        }),
        // Определение метода для получения текущего пользователя
        current: builder.query<User, void>({
            query: () => ({
                url: '/current',
                method: 'GET'
            }),
        }),
        // Определение метода для получения пользователя по его идентификатору
        getUserById: builder.query<User, string>({
            query: (id) => ({
                url: `/users/${id}`,
                method: "GET",
            }),
        }),
        // Определение метода для обновления данных пользователя
        updateUser: builder.mutation<User, { userData: FormData; id: string }>({
            query: ({ userData, id }) => ({
                url: `/users/${id}`,
                method: "PUT",
                body: userData,
            }),
        }),
    }),
})

export const { //экспорт хуков
    useRegisterMutation,
    useLoginMutation,
    useCurrentQuery, //при запуске компонента отправить запрос
    useLazyCurrentQuery, //в любой момент можем изменять
    useGetUserByIdQuery,
    useLazyGetUserByIdQuery,
    useUpdateUserMutation,
} = userApi;

export const { //отдельные объекты, используются вне контекста хуков.
    endpoints: { login, register, current, getUserById, updateUser },
} = userApi;