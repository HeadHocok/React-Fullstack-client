import React from "react"
import { Link } from "react-router-dom"
import { Button } from "../button"

type Props = {
    children: React.ReactNode
    icon: JSX.Element
    href: string
}

export const NavButton: React.FC<Props> = ({ children, icon, href }) => { //Кнопки в навигации. Перенаправляют на переданный адрес
    return (
        //Оборачиваем нашу кнопку в линк чтобы при клике по любой части кнопки происходил переход
         <Link to={href}>
            <Button icon={icon} className="flex justify-start text-xl">
                {children}
            </Button>
        </Link>
    );
}