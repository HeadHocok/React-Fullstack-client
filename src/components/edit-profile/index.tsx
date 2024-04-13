import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from "@nextui-org/react"
import React, { useContext, useState } from "react"
import { ThemeContext } from "../theme-provider"
import { Controller, useForm } from "react-hook-form"
import { User } from "../../app/types"
import { useUpdateUserMutation } from "../../app/services/userApi"
import { useParams } from "react-router-dom"
import { hasErrorField } from "../../utils/has-error-field"
import { ErrorMessage } from "../error-message"
import { MdOutlineEmail } from "react-icons/md"
import {Input} from "../input/input";

type Props = {
    isOpen: boolean
    onClose: () => void //при закрытии - исчезает
    user?: User;
}

export const EditProfile: React.FC<Props> = ({
    isOpen = false,
    onClose = () => null,
    user,
}) => {
    const { theme } = useContext(ThemeContext) //модалка рендерится вне реакт компонента потому обязательно нужна тема
    const [updateUser, { isLoading }] = useUpdateUserMutation()
    const [error, setError] = useState("")
    const [selectedFile, setSelectedFile] = useState<File | null>(null) //здесь храним файл
    const { id } = useParams<{ id: string }>() //вытягиваем наш айдишник

    const { handleSubmit, control } = useForm<User>({ //обработка события отправки
        mode: "onChange", //Валидация при каждом изменении поля ввода
        reValidateMode: "onBlur", //Валидация при потере фокуса с поля ввода
        defaultValues: {
            email: user?.email,
            name: user?.name,
            dateOfBirth: user?.dateOfBirth,
            bio: user?.bio,
            location: user?.location,
        },
    })

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files !== null) { //если файл действительно есть
            setSelectedFile(event.target.files[0])
        }
    }

    const onSubmit = async (data: User) => {
        if (id) {
            try {
                const formData = new FormData(); //мы отправляем в formData только то, что было введено
                data.name && formData.append("name", data.name)
                data.email && data.email !== user?.email && formData.append("email", data.email)
                data.dateOfBirth && formData.append(
                    "dateOfBirth",
                    new Date(data.dateOfBirth).toISOString(), //преобразовываем дату в формат ISO
                )
                data.bio && formData.append("bio", data.bio)
                data.location && formData.append("location", data.location)
                selectedFile && formData.append("avatar", selectedFile) //если в стейте у нас есть файл. Мы говорим multer следить за полем avatar в backend (не avatarUrl)

                await updateUser({ userData: formData, id }).unwrap()
                onClose()
            } catch (error) {
                if (hasErrorField(error)) {
                    setError(error.data.error);
                }
            }
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className={`${theme} text-foreground`}
            backdrop="blur"
        >
            <ModalContent>
                {
                    (onClose) => ( //функция обратного вызова. При закрытии будет применять все что внутри
                        <>
                            <ModalHeader className='flex flex-col gap-1'>
                                Изменение профиля
                            </ModalHeader>
                            <ModalBody>
                                <form
                                    className='flex flex-col gap-4'
                                    onSubmit={handleSubmit(onSubmit)} //инпут с файлом обрабатывает отдельно
                                >
                                    <Input
                                        control={control}
                                        name="email"
                                        label="Email"
                                        type="email"
                                        endContent={<MdOutlineEmail />}
                                    />
                                    <Input
                                        control={control}
                                        name="name"
                                        label="Имя"
                                        type="text"
                                    />
                                    <input //обычный инпут для отправки файла
                                        name="avatarUrl"
                                        placeholder="Выберете файл"
                                        type="file"
                                        onChange={handleFileChange}
                                    />
                                    <Input
                                        control={control}
                                        name="dateOfBirth"
                                        label="Дата Рождения"
                                        type="date"
                                        placeholder="Мой"
                                    />
                                    <Controller
                                        name="bio"
                                        control={control}
                                        render={({ field }) => (
                                            <Textarea
                                                {...field}
                                                rows={4}
                                                placeholder="Ваша биография"
                                            />
                                        )}
                                    />
                                    <Input
                                        control={control}
                                        name="location"
                                        label="Местоположение"
                                        type="text"
                                    />
                                    <ErrorMessage error={error} />
                                    <div className="flex gap-2 justify-end">
                                        <Button
                                            fullWidth
                                            color="primary"
                                            type="submit"
                                            isLoading={isLoading}
                                        >
                                            Обновить профиль
                                        </Button>
                                    </div>
                                </form>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Закрыть
                                </Button>
                            </ModalFooter>
                        </>
                    )
                }
            </ModalContent>
        </Modal>
    );
};