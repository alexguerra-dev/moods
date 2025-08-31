export const formatTime = (date: Date | string | null | undefined): string => {
    // Handle invalid or null dates
    if (!date) {
        return 'Unknown time'
    }

    // Convert string to Date if needed
    const dateObj = date instanceof Date ? date : new Date(date)

    // Check if the Date is valid
    if (isNaN(dateObj.getTime())) {
        return 'Invalid time'
    }

    return dateObj.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    })
}

export const formatDate = (date: Date | string | null | undefined): string => {
    // Handle invalid or null dates
    if (!date) {
        return 'Unknown date'
    }

    // Convert string to Date if needed
    const dateObj = date instanceof Date ? date : new Date(date)

    // Check if the Date is valid
    if (isNaN(dateObj.getTime())) {
        return 'Invalid date'
    }

    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (dateObj.toDateString() === today.toDateString()) {
        return 'Today'
    } else if (dateObj.toDateString() === yesterday.toDateString()) {
        return 'Yesterday'
    } else {
        return dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        })
    }
}

export const formatFullDate = (
    date: Date | string | null | undefined,
): string => {
    // Handle invalid or null dates
    if (!date) {
        return 'Unknown date'
    }

    // Convert string to Date if needed
    const dateObj = date instanceof Date ? date : new Date(date)

    // Check if the Date is valid
    if (isNaN(dateObj.getTime())) {
        return 'Invalid date'
    }

    return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

export const isToday = (date: Date | string | null | undefined): boolean => {
    // Handle invalid or null dates
    if (!date) {
        return false
    }

    // Convert string to Date if needed
    const dateObj = date instanceof Date ? date : new Date(date)

    // Check if the Date is valid
    if (isNaN(dateObj.getTime())) {
        return false
    }

    const today = new Date()
    return dateObj.toDateString() === today.toDateString()
}

export const isThisWeek = (date: Date | string | null | undefined): boolean => {
    // Handle invalid or null dates
    if (!date) {
        return false
    }

    // Convert string to Date if needed
    const dateObj = date instanceof Date ? date : new Date(date)

    // Check if the Date is valid
    if (isNaN(dateObj.getTime())) {
        return false
    }

    const today = new Date()
    const weekAgo = new Date(today)
    weekAgo.setDate(today.getDate() - 7)
    return dateObj >= weekAgo
}
