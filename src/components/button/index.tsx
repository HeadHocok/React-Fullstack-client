//Собственный компонент Button. Зачем это делать? Чтобы в случае смены ui библиотеки не менять все кнопки. А также ради двух свойств size и variant

import React from 'react'
import {Button as NextButton} from "@nextui-org/react"; //переименовываем чтобы не конфликтовало

type Props = {
    children: React.ReactNode;
    icon: JSX.Element;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    fullWidth?: boolean;
    color?:
        "default" |
        "primary" |
        "secondary" |
        "success" |
        "warning" |
        "danger" |
        undefined;
}

export const Button: React.FC<Props> = ({
    children,
    className,
    color,
    icon,
    fullWidth,
    type
}) => {
    return (
        <NextButton
        startContent={icon}
        size='lg'
        color={color}
        variant='light'
        className={className}
        type={type}
        fullWidth={fullWidth}
        >
            { children }
        </NextButton>
    )
}