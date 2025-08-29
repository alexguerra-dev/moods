import type { MoodEntry } from '../types/mood'

const STORAGE_KEY = 'moods-app-data'

export const loadMoodHistory = (): MoodEntry[] => {
    try {
        const savedData = localStorage.getItem(STORAGE_KEY)
        if (savedData) {
            const parsed = JSON.parse(savedData)
            // Convert timestamp strings back to Date objects
            return parsed.map((entry: any) => ({
                ...entry,
                timestamp: new Date(entry.timestamp),
            }))
        }
    } catch (error) {
        console.error('Error loading mood data:', error)
    }
    return []
}

export const saveMoodHistory = (moodHistory: MoodEntry[]): void => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(moodHistory))
    } catch (error) {
        console.error('Error saving mood data:', error)
    }
}

export const clearMoodHistory = (): void => {
    try {
        localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
        console.error('Error clearing mood data:', error)
    }
}

export const getMoodStats = (moodHistory: MoodEntry[]) => {
    const moodCounts: Record<string, number> = {}
    let totalIntensity = 0
    let intensityCount = 0

    moodHistory.forEach((entry) => {
        // Count moods
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1

        // Calculate average intensity
        if (entry.intensity) {
            const intensityValue =
                entry.intensity === 'low'
                    ? 1
                    : entry.intensity === 'medium'
                    ? 2
                    : 3
            totalIntensity += intensityValue
            intensityCount++
        }
    })

    const mostFrequentMood =
        Object.entries(moodCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ||
        'None'

    const averageIntensity =
        intensityCount > 0 ? totalIntensity / intensityCount : 0

    return {
        totalEntries: moodHistory.length,
        mostFrequentMood,
        averageIntensity: Math.round(averageIntensity * 10) / 10,
        moodCounts,
    }
}
