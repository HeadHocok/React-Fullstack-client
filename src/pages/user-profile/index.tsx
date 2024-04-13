//модальное окно выбранного пользователя

import React, {useEffect} from 'react'
import {useParams} from "react-router-dom";
import {Button, Card, Image, useDisclosure} from "@nextui-org/react";
import {useDispatch, useSelector} from "react-redux";
import {resetUser, selectCurrent} from "../../features/user/userSlice";
import {useGetUserByIdQuery, useLazyCurrentQuery, useLazyGetUserByIdQuery} from "../../app/services/userApi";
import {useFollowUserMutation, useUnfollowUserMutation} from "../../app/services/followApi";
import {GoBack} from "../../components/goback";
import {BASE_URL} from "../../constants";
import {MdOutlinePersonAddAlt1, MdOutlinePersonAddDisabled} from "react-icons/md";
import {CiEdit} from "react-icons/ci";
import {ProfileInfo} from "../../components/profile-info";
import {formatToClientDate} from "../../utils/format-to-client-date";
import {CountInfo} from "../../components/count-info";
import {EditProfile} from "../../components/edit-profile";

export const UserProfile = () => {
    const { id } = useParams<{id: string}>() //прокинули тип для функции (параметры - всегда объект)
    const { isOpen, onOpen, onClose } = useDisclosure(); //для модального окна
    const currentUser = useSelector(selectCurrent);
    const { data } = useGetUserByIdQuery(id ?? '');
    const [followUser] = useFollowUserMutation();
    const [unfollowUser] = useUnfollowUserMutation();
    const [triggerGetUserByIdQuery] = useLazyGetUserByIdQuery();
    const [triggerCurrentQuery] = useLazyCurrentQuery();

    const dispatch = useDispatch();

    useEffect(() => () => {
        dispatch(resetUser())
    }, [])

    const handleFollow = async () => {  //обработчик подписки
        try {
            if (id) {
                data?.isFollowing
                    ? await unfollowUser(id).unwrap()
                    : await followUser({ followingId: id }).unwrap();

                await triggerGetUserByIdQuery(id); //получаем данные пользователя

                await triggerCurrentQuery(); //получаем данные наших подписок
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleClose = async () => { //вызываем получение пользователя заново чтобы подтягивать информацию, а затем уже закрываем
        try {
            if (id) {
                await triggerGetUserByIdQuery(id)
                await triggerCurrentQuery()
                onClose()
            }
        } catch (error) {
            console.error(error)
        }
    }

    if (!data) {
        return null
    }

    return (
        <>
            <GoBack />
            <div className="flex items-stretch gap-4">
                <Card className="flex flex-col items-center text-center space-y-4 p-5 flex-2">
                    <Image
                        src={`${BASE_URL}${data.avatarUrl}`}
                        alt={data.name}
                        width={200}
                        height={200}
                        className='border-4 border-white'
                    />
                    <div className="flex flex-col text-2xl font-bold gap-4 items-center"> {/*либо кнопка подписаться, либо редактировать*/}
                        {data.name}
                        {currentUser?.id !== id ? ( //если мы смотрим не на свой профиль
                            <Button
                                color={data?.isFollowing ? "default" : "primary"}
                                variant="flat"
                                className="gap-2"
                                onClick={ handleFollow }
                                endContent={
                                    data?.isFollowing ? (
                                        <MdOutlinePersonAddDisabled />
                                    ) : (
                                        <MdOutlinePersonAddAlt1 />
                                    )
                                }
                            >
                                {data?.isFollowing ? 'Отписаться' : 'Подписаться'}
                            </Button>
                        ) : ( //если это наш профиль - кнопка редактировать профиль
                            <Button
                                endContent={<CiEdit />}
                                onClick={() => onOpen()} //слушатель кнопки
                            >
                                Редактировать
                            </Button>
                        )}
                    </div>
                </Card>
                <Card className="flex flex-col space-y-4 p-5 flex-1">
                    <ProfileInfo title="Почта:" info={data.email} />
                    <ProfileInfo title="Местоположение:" info={data.location} />
                    <ProfileInfo title="Дата рождения:" info={formatToClientDate(data.dateOfBirth)} />
                    <ProfileInfo title="Обо мне:" info={data.bio} />

                    <div className="flex gap-2">
                        <CountInfo count={data.followers.length} title="Подписчики"/>
                        <CountInfo count={data.following.length} title="Подписки"/>
                    </div>
                </Card>
            </div>
            <EditProfile isOpen={isOpen} onClose={handleClose} user={data}/>
        </>
    )
}