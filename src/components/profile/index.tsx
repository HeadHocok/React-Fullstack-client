import React from 'react'
import {useSelector} from "react-redux";
import {selectCurrent} from "../../features/user/userSlice";
import {Card, CardBody, CardHeader, Image} from "@nextui-org/react";
import {BASE_URL} from "../../constants";
import {Link} from "react-router-dom";
import {MdAlternateEmail} from "react-icons/md";

export const Profile = () => {
    const current = useSelector(selectCurrent);

    if (!current) { //если не нашли профиль - ничего не выдаем
        return null;
    }

    const { name, email, avatarUrl, id } = current; //деструктуризацию делать нельзя, чтобы избежать проблем с undefined

    return (
        <Link to={`/users/${id}`}>
            <Card className='py-4 w-[302px]'>
                <CardHeader className='pb-0 pt-2 px-4 flex-col items-center'>
                    <Image
                        alt='Card profile'
                        className='object-cover rounded-xl'
                        src={`${BASE_URL}${avatarUrl}`}
                        width={370}
                    />
                </CardHeader>
                <CardBody>
                    <h4 className="font-bold text-large mb-2">{name}</h4>
                    <p className="text-default-500 flex items-center gap-2">
                        <MdAlternateEmail />
                        { email }
                    </p>
                </CardBody>
            </Card>
        </Link>
    )
}