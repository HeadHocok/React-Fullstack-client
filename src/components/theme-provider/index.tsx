import React from "react"

type ThemeContextType = {
    theme: "dark" | "light"
    toggleTheme: () => void //функция - переключатель. Не возвращает значение
}

export const ThemeContext = React.createContext<ThemeContextType>({
    theme: "dark",
    toggleTheme: () => null,
})

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const storedTheme = localStorage.getItem('theme'); //берем тему
    const currentTheme = storedTheme ? storedTheme as 'dark' | 'light' : 'dark'; //если была тема - передаем. Иначе по дефолту dark

    const [theme, setTheme] = React.useState<"dark" | "light">(currentTheme) //локально обновляем текущую тему в браузере

    const toggleTheme = () => { //переключение темы. Изменяет текущую тему на противоположную и сохраняет ее в localStorage.
        setTheme((prevTheme) => {
            const newTheme = prevTheme === "light" ? "dark" : "light";
            localStorage.setItem('theme', newTheme);

            return newTheme
        })
    }

    return ( //Дочерние компоненты оборачиваются в провайдер темы. В контекст передаются текущая тема и функция переключения темы.
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <main className={`${theme} text-foreground bg-background`}>
                {children}
            </main>
        </ThemeContext.Provider>
    )
}