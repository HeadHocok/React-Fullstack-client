//Запрашивает пользователя при старте приложения. Пока идет запрос - пользователь не отрисуется

import React from 'react'
import {useCurrentQuery} from "../../app/services/userApi";
import {Spinner} from "@nextui-org/react";

export const AuthGuard = ({children}: {children: JSX.Element}) => {
    const { isLoading } = useCurrentQuery(); //Когда пройдёт - мы будем знать, либо у нас токен либо ничего не будет

    if (isLoading) {
        return <Spinner />
    }

    return children;
}