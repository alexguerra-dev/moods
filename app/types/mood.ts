export interface MoodEntry {
    id: string
    mood: string
    timestamp: Date
    intensity?: 'low' | 'medium' | 'high'
    note?: string
}

export interface MoodOption {
    name: string
    emoji: string
    color: string
    description?: string
}

export type MoodIntensity = 'low' | 'medium' | 'high'

export interface MoodStats {
    totalEntries: number
    mostFrequentMood: string
    averageIntensity: number
    moodCounts: Record<string, number>
}
