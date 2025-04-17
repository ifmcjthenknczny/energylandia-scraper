export const bgColor = (theme: string | undefined) => {
    return !theme || theme === 'dark' ? '#0a0a0a' : '#c9c9c9'
}

export const fontColor = (theme: string | undefined) => {
    return !theme || theme === 'dark' ? '#e2e8f0' : '#000000'
}

export const gridlinesColor = (theme: string | undefined) => {
    return !theme || theme === 'dark' ? '#d0d0d0' : '2f2f2f'
}
