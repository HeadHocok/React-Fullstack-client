//пост-контейнер в списке постов

import React, {useState} from 'react';

import {Card as NextUiCard, CardBody, CardFooter, CardHeader, Spinner} from "@nextui-org/react";
import {useLikePostMutation, useUnlikePostMutation} from "../../app/services/likesApi";
import {useDeletePostMutation, useLazyGetAllPostsQuery, useLazyGetPostByIdQuery} from "../../app/services/postsApi";
import {useDeleteCommentMutation} from "../../app/services/commentsApi";
import {Link, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectCurrent} from "../../features/user/userSlice";
import {User} from "../user";
import {formatToClientDate} from "../../utils/format-to-client-date";
import {RiDeleteBinLine} from "react-icons/ri";
import {Typography} from "../typography";
import {MetaInfo} from "../meta-info";
import {FcDislike} from "react-icons/fc";
import {MdOutlineFavoriteBorder} from "react-icons/md";
import {FaRegComment} from "react-icons/fa";
import {ErrorMessage} from "../error-message";
import {hasErrorField} from "../../utils/has-error-field";

type Props = {
    avatarUrl: string;
    name: string;
    authorId: string;
    content: string;
    commentId?: string;
    likesCount?: number;
    commentsCount?: number;
    createdAt?: Date;
    id?: string;
    cardFor: 'comment' | 'post' | 'current-post' //чем является наша карточка
    likedByUser?: boolean;
}

export const Card: React.FC<Props> = ({
    avatarUrl = '',
    name = '',
    authorId = '',
    content = '',
    commentId = '',
    likesCount = 0,
    commentsCount = 0,
    createdAt,
    id = '',
    cardFor = 'post',
    likedByUser = false,
}) => {
    const [likePost] = useLikePostMutation();
    const [unlikePost] = useUnlikePostMutation();
    const [triggerGetAllPosts] = useLazyGetAllPostsQuery();
    const [triggerGetPostById] = useLazyGetPostByIdQuery();
    const [deletePost, deletePostStatus] = useDeletePostMutation();
    const [deleteComment, deleteCommentStatus] = useDeleteCommentMutation();
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const currentUser = useSelector(selectCurrent);

    const refetchPosts = async () => { //обработчик обновления
        switch (cardFor) {
            case 'post':
                await triggerGetAllPosts().unwrap();
                break;
            case 'current-post':
                await triggerGetPostById(id).unwrap();
                break;
            case 'comment':
                await triggerGetPostById(id).unwrap();
                break;
            default:
                throw new Error('Wrong argument cardFor');
        }
    }

    const handleDelete = async () => { //обработчик удаления
        try {
            switch (cardFor) {
                case 'post': //удалить пост
                    await deletePost(id).unwrap();
                    await refetchPosts();
                    break;
                case 'current-post': //удалить пост находясь внутри поста
                    await deletePost(id).unwrap();
                    navigate('/');
                    break;
                case 'comment': //удалить коммент
                    await deleteComment(commentId).unwrap(); //commentId - id поста
                    await refetchPosts();
                    break;
                default:
                    throw new Error('Wrong argument cardFor')
            }
        } catch (error) {
            if (hasErrorField(error)) {
                setError(error.data.error)
            } else {
                setError(error as string);
            }
        }
    }

    const handleClick = async () => { //обработчик нажатия
        try {
            likedByUser
                ? await unlikePost(id).unwrap()
                : await likePost({ postId: id }).unwrap();

            await refetchPosts(); //обновляем пост
        } catch (error) {
            if (hasErrorField(error)) {
                setError(error.data.error)
            } else {
                setError(error as string);
            }
        }
    }

    return (
        <NextUiCard className='mb-5'>
            <CardHeader className='justify-between items-center bg-transparent'>
                <Link to={`/users/${authorId}`}> {/*Ссылка на автора поста*/}
                    <User
                        name={name}
                        className='text-small font-semibold leading-non text-default-600'
                        avatarUrl={avatarUrl}
                        description={ createdAt && formatToClientDate(createdAt) }
                    />
                </Link>
                {
                    authorId === currentUser?.id && (  //если автор является текущему пользователю - мы можем удалять этот комментарий
                        <div className="cursor-pointer" onClick={ handleDelete }>
                            {deletePostStatus.isLoading || deleteCommentStatus.isLoading ? ( //если идет загрузка - отображаем загрузку
                                <Spinner />
                            ) : (
                                <RiDeleteBinLine />
                            )}
                        </div>
                    )
                }
            </CardHeader>
            <CardBody className='px-3 py-2 mb-5'>
                <Typography>{ content }</Typography>
            </CardBody>
            {
                cardFor !== 'comment' && ( //если состояние карты не является комментарием
                    <CardFooter className='gap-3'>
                        <div className='flex gap-5 items-center h-[24px]'>
                            <div onClick={ handleClick }>
                                <MetaInfo
                                    count={likesCount}
                                    Icon={likedByUser ? FcDislike : MdOutlineFavoriteBorder} //Если лайкнули - отображаем иконку дизлайка и наоборот
                                />
                            </div>
                            <Link to={`/posts/${id}`}>
                                <MetaInfo
                                    count={commentsCount}
                                    Icon={FaRegComment}
                                />
                            </Link>
                        </div>
                        <ErrorMessage error={error} />
                    </CardFooter>
                )
            }
        </NextUiCard>
    );
};