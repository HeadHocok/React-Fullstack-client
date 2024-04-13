//отвечает за иконку лайка и иконку комментария и отображает их кол-во

import React from 'react';
import {IconType} from "react-icons";

type Props = {
    count: number;
    Icon: IconType; //Мы передаем компонент иконки потому с большой буквы. Так реакт будет понимать что это компонент
}

export const MetaInfo: React.FC<Props> = ({
    count,
    Icon,
}) => {

    return (
        <div className='flex items-center gap-2 cursor-pointer'>
            {
                count > 0 && ( //если лайков нет - не будем показывать
                    <p className='font-semibold text-default-400 text-l'>{ count }</p>
                )
            }
            <p className="text-default-500 text-xl hover:text-2xl ease-in duration-100">
                <Icon />
            </p>
        </div>
    );
};