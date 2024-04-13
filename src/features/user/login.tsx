import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Input} from "../../components/input/input";
import { Button, Link } from "@nextui-org/react"
import {useLazyCurrentQuery, useLoginMutation} from "../../app/services/userApi";
import {useNavigate} from "react-router-dom";
import {ErrorMessage} from "../../components/error-message";
import {hasErrorField} from "../../utils/has-error-field";

type Login = {
    email: string;
    password: string;
}

type Props = {
    setSelected: (value: string) => void; //мы прямо из этого компонента меняем либо вход, либо регистрация. И когда мы зарегистрировались мы должны поменять на вход
}

export const Login: React.FC<Props> = ({ setSelected }) => {
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<Login>({
        mode: 'onChange',
        reValidateMode: 'onBlur',
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const [ login, {isLoading} ] = useLoginMutation(); //возвращает функцию которую нужно вызвать, принимает состояние
    const navigate = useNavigate(); //навигация по страницам
    const [error, setError] = useState('');
    const [triggerCurrentCuery] = useLazyCurrentQuery(); //запрашиваем пользователя после того как залогинились

    const onSubmit = async (data: Login) => {
        try {
            await login(data).unwrap(); //unwrap обязательно чтобы упало в catch при неудачной попытке
            await triggerCurrentCuery().unwrap();
            navigate('/')
        } catch (error) {
            if (hasErrorField(error)) { //передаем ошибку и смотрим есть ли там поле с сообщением
                setError(error.data.error); //выставляем
            }
        }
    }

    return (
        <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
            <Input
                control={control}
                name="email"
                label="Email"
                type="email"
                required="Обязательное поле"
            />
            <Input
                control={control}
                name="password"
                label="Пароль"
                type="password"
                required="Обязательное поле"
            />
            <ErrorMessage error={ error }/> {/*кастомная ошибка из стейта*/}
            <p className="text-center text-small">
                Нет аккаутна?{" "}
                <Link
                    size="sm"
                    className="cursor-pointer"
                    onPress={() => setSelected("sign-up")} //переключаем на другую вкладку
                >
                    Зарегистрируйтесь
                </Link>
            </p>
            <div className="flex gap-2 justify-end">
                <Button fullWidth color='primary' type='submit' isLoading={isLoading}>
                    Войти
                </Button>
            </div>
        </form>
    )
}