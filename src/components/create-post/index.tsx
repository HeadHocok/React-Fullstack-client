import React from 'react';
import {useCreatePostMutation, useLazyGetAllPostsQuery} from "../../app/services/postsApi";
import {Controller, useForm} from "react-hook-form";
import {Button, Textarea} from "@nextui-org/react";
import {ErrorMessage} from "../error-message";
import {IoMdCreate} from "react-icons/io";

export const CreatePost = () => {
    const [createPost] = useCreatePostMutation();
    const [triggerAllPosts] = useLazyGetAllPostsQuery();

    const {
        handleSubmit,
        control,
        formState: { errors },
        setValue
    } = useForm()

    const error = errors?.post?.message as string; //деструктуризируем ошибку для вывода

    const onSubmit = handleSubmit(async (data) => {
        try {
            await createPost({content: data.post}).unwrap(); //создаем пост, ждем
            setValue('post', ''); //обнуляем инпут
            await triggerAllPosts().unwrap(); //обновляем посты (можно сделать и по другому, складывая и добавляя посты по 1, но проще перезапросить все заново)
        } catch (error) {
            console.log(error)
        }
    })

    return (
        <form className='flex-grow' onSubmit={onSubmit}>
            <Controller
                name='post'
                control={control}
                defaultValue=""
                rules={{
                    required: 'Обязательное поле'
                }}
                render={({ field }) => (
                    <Textarea
                        {...field}
                        labelPlacement='outside'
                        placeholder='О чем думаете?'
                        className='mb-5'
                    />
                )}
            />

            { errors && <ErrorMessage error={ error }/>}

            <Button
                color='success'
                className='flex-end'
                endContent={<IoMdCreate />}
                type='submit'
            >
                Добавить пост
            </Button>
        </form>
    );
};