import React from 'react';
import { Button, Textarea } from "@nextui-org/react"
import { IoMdCreate } from "react-icons/io"
import { useForm, Controller } from "react-hook-form"
import { ErrorMessage } from "../error-message"
import { useCreateCommentMutation } from "../../app/services/commentsApi"
import { useParams } from "react-router-dom"
import { useLazyGetPostByIdQuery } from "../../app/services/postsApi"

export const CreateComment = () => {
    const { id } = useParams<{id: string}>()
    const [createComment] = useCreateCommentMutation()
    const [getPostById] = useLazyGetPostByIdQuery()

    const {
        handleSubmit,
        control,
        formState: { errors },
        setValue
    } = useForm()

    const error = errors?.post?.message as string; //деструктуризируем ошибку для вывода

    const onSubmit = handleSubmit(async (data) => {
        try {
            if (id) {
                await createComment({content: data.comment, postId: id}).unwrap(); //создаем коммент, ждем
                setValue('comment', ''); //обнуляем инпут
                await getPostById(id).unwrap(); //обновляем сам пост
            }
        } catch (error) {
            console.log(error)
        }
    })

    return (
        <form className='flex-grow' onSubmit={onSubmit}>
            <Controller
                name='comment'
                control={control}
                defaultValue=""
                rules={{
                    required: 'Обязательное поле'
                }}
                render={({ field }) => (
                    <Textarea
                        {...field}
                        labelPlacement='outside'
                        placeholder='Написать комментарий...'
                        className='mb-5'
                    />
                )}
            />

            { errors && <ErrorMessage error={ error }/>}

            <Button
                color='primary'
                className='flex-end'
                endContent={<IoMdCreate />}
                type='submit'
            >
                Ответить
            </Button>
        </form>
    );
};