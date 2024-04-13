//оборачивает все компоненты чтобы у них была общая верстка

import React, {useEffect} from 'react'
import {Header} from "../header";
import {Container} from "../container";
import {NavBar} from "../nav-bar";
import {Outlet, useNavigate} from "react-router-dom";
import {selectIsAuthenticated, selectUser} from "../../features/user/userSlice";
import {useSelector} from "react-redux";
import {Profile} from "../profile";

export const Layout = () => { //Навигация, разные компоненты (<Outlet />), профиль
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectUser);
    const navigate = useNavigate();

    useEffect(() => { //если аутентификации нет - не пускаем дальше
        if (!isAuthenticated) {
            navigate('/auth');
        }
    }, [])

    return (
        <>
            <Header />
            <Container>
                <div className="flex-2 p-4">
                    <NavBar />
                </div>
                <div className="flex-1 p-4">
                    <Outlet />
                </div>
                <div className="flex-2 p-4">
                    <div className="flex-col flex gap-5">
                        {!user && <Profile />}  {/*мы не будем отображать профиль если мы находимся внутри страницы пользователя*/}
                    </div>
                </div>
            </Container>
        </>
    )
}