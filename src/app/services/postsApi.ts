import { Post } from "../types"
import { api } from "./api"

export const postApi = api.injectEndpoints({ //вызываем объект
    endpoints: (builder) => ({ //возвращаем объект наших методов. Мы их НЕ ВЫЗЫВАЕМ СРАЗУ, а лишь передаем
        createPost: builder.mutation<Post, { content: string }>({ //Ответ отправляем типа Post. Принимаем объект с одним свойством content, которое должно быть строкового типа
            query: (postData) => ({ //объект, который принимает описание
                url: "/posts", //как мы будем обращаться
                method: "POST", //метод обращения
                body: postData, //описание поста, которое нам передали в content
            }),
        }),
        getAllPosts: builder.query<Post[], void>({
            query: () => ({
                url: "/posts",
                method: "GET",
            }),
        }),
        getPostById: builder.query<Post, string>({
            query: (id) => ({
                url: `/posts/${id}`,
                method: "GET",
            }),
        }),
        deletePost: builder.mutation<void, string>({
            query: (id) => ({
                url: `/posts/${id}`,
                method: "DELETE",
            }),
        }),
    }),
})

export const {
    useCreatePostMutation,
    useGetAllPostsQuery, //вызвать сразу при загрузке компонента
    useGetPostByIdQuery,
    useDeletePostMutation,
    useLazyGetAllPostsQuery, //предоставляет функцию, которая будет выполнена только при вызове. Пример: call и bind в js
    useLazyGetPostByIdQuery,
} = postApi

export const {
    endpoints: { createPost, getAllPosts, getPostById, deletePost },
} = postApi