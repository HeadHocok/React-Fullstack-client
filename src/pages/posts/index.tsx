import React from 'react'
import {useGetAllPostsQuery} from "../../app/services/postsApi";
import {CreatePost} from "../../components/create-post";
import {Card} from "../../components/card";

export const Posts = () => {
    const { data } = useGetAllPostsQuery();

    return (
        <>
            <div className='mb-10 w-full'>
                <CreatePost />
            </div>
            {
                data && data.length > 0 //если у нас есть посты - значит проходимся по всем циклом и выводим
                    ? data.map(({
                        content,
                        author,
                        id,
                        authorId,
                        comments,
                        likes,
                        likedByUser,
                        createdAt
                    }) => (
                        <Card
                            key={id} //т.к мы выводим посты через map из массива нам обязательно нужно указывать уник. id
                            avatarUrl={author.avatarUrl ?? ''}
                            content={content}
                            name={author.name ?? ''}
                            likesCount ={likes.length}
                            commentsCount={comments.length}
                            authorId={authorId}
                            id={id}
                            likedByUser={likedByUser}
                            createdAt={createdAt}
                            cardFor='post'
                        />
                    )) : null
            }
        </>
    )
}