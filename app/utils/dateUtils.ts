export const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    })
}

export const formatDate = (date: Date): string => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
        return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday'
    } else {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        })
    }
}

export const formatFullDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

export const isToday = (date: Date): boolean => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
}

export const isThisWeek = (date: Date): boolean => {
    const today = new Date()
    const weekAgo = new Date(today)
    weekAgo.setDate(today.getDate() - 7)
    return date >= weekAgo
}
