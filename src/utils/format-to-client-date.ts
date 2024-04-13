//Перевод на локальное время
export const formatToClientDate = (date?: Date) => {
    if (!date) {
        return ''
    }

    return new Date(date).toLocaleDateString()
}