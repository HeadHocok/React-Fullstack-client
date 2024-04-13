import React from 'react'
import {useParams} from "react-router-dom";
import {useGetPostByIdQuery} from "../../app/services/postsApi";
import {Card} from "../../components/card";
import {GoBack} from "../../components/goback";
import {CreateComment} from "../../components/create-comment";

export const CurrentPost = () => {
    const params = useParams<{id: string}>() //прокинули тип для функции (параметры - всегда объект)
    const { data } = useGetPostByIdQuery (params?.id ?? '');

    if (!data) {
        return <h2>Post not found</h2>
    }

    const { //деструктуризация из даты
        content,
        id,
        authorId,
        comments,
        likes,
        author,
        likedByUser,
        createdAt,
    } = data;


    return (
        <>
            <GoBack />
            <Card
                avatarUrl={author.avatarUrl ?? ''}
                content={content}
                name={author.name ?? ''}
                likesCount={likes.length}
                authorId={authorId}
                id={id}
                likedByUser={likedByUser}
                createdAt={createdAt}
                cardFor='current-post'
            />
            <div className="mt-10">
                <CreateComment />
            </div>
            <div className="mt-10">
                {
                    data.comments ?
                        data.comments.map((comment) => ( //циклично вызываем комментарии
                            <Card
                                cardFor="comment"
                                key={comment.id}
                                avatarUrl={comment.user.avatarUrl ?? ""}
                                content={comment.content}
                                name={comment.user.name ?? ""}
                                authorId={comment.userId}
                                commentId={comment.id}
                                id={id} //id поста
                            />
                        )) : null
                }
            </div>
        </>
    )
}