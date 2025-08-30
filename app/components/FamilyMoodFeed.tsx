'use client'

import { useState, useEffect } from 'react'
import type { MoodEntryWithUser } from '../types/user'
import { formatTime, formatDate } from '../utils/dateUtils'

interface FamilyMoodFeedProps {
    currentUserId: string
}

export default function FamilyMoodFeed({ currentUserId }: FamilyMoodFeedProps) {
    const [familyMoods, setFamilyMoods] = useState<MoodEntryWithUser[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string>('')

    useEffect(() => {
        loadFamilyMoods()
        // Set up polling to refresh moods every 30 seconds
        const interval = setInterval(loadFamilyMoods, 30000)
        return () => clearInterval(interval)
    }, [])

    const loadFamilyMoods = async () => {
        try {
            setIsLoading(true)
            const response = await fetch('/api/moods')
            const data = await response.json()

            if (data.success) {
                setFamilyMoods(data.moods)
            } else {
                setError('Failed to load family moods')
            }
        } catch {
            setError('Network error loading family moods')
        } finally {
            setIsLoading(false)
        }
    }

    const clearAllMoods = async () => {
        if (
            !confirm(
                'Are you sure you want to clear all family moods? This cannot be undone.',
            )
        ) {
            return
        }

        try {
            const response = await fetch('/api/moods', {
                method: 'DELETE',
            })
            const data = await response.json()

            if (data.success) {
                setFamilyMoods([])
            } else {
                setError('Failed to clear moods')
            }
        } catch {
            setError('Network error clearing moods')
        }
    }

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="text-center py-8">
                    <div className="text-gray-500">Loading family moods...</div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="text-center py-4">
                    <div className="text-red-500 mb-2">{error}</div>
                    <button
                        onClick={loadFamilyMoods}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                    >
                        Try again
                    </button>
                </div>
            </div>
        )
    }

    if (familyMoods.length === 0) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="text-center py-8">
                    <div className="text-2xl mb-2">📝</div>
                    <div className="text-gray-600 mb-2">
                        No moods logged yet
                    </div>
                    <div className="text-sm text-gray-500">
                        Be the first to share how you&apos;re feeling!
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                    Family Mood Feed
                </h3>
                <button
                    onClick={clearAllMoods}
                    className="text-sm text-red-500 hover:text-red-700"
                >
                    Clear All
                </button>
            </div>

            <div className="space-y-4">
                {familyMoods.map((entry) => (
                    <div
                        key={entry.id}
                        className={`p-4 rounded-xl border-l-4 ${
                            entry.userId === currentUserId
                                ? 'bg-blue-50 border-blue-400'
                                : 'bg-gray-50 border-gray-300'
                        }`}
                    >
                        <div className="flex items-start gap-3">
                            <div
                                className="text-2xl p-2 rounded-full"
                                style={{
                                    backgroundColor: `${entry.userColor}20`,
                                }}
                            >
                                {entry.userIcon}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-gray-800">
                                        {entry.userName}
                                    </span>
                                    {entry.userId === currentUserId && (
                                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                            You
                                        </span>
                                    )}
                                </div>
                                <div className="text-lg font-semibold text-gray-800 mb-1">
                                    {entry.mood}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {entry.intensity} intensity •{' '}
                                    {formatTime(entry.timestamp)} •{' '}
                                    {formatDate(entry.timestamp)}
                                </div>
                                {entry.note && (
                                    <div className="mt-2 p-2 bg-white rounded-lg text-sm text-gray-700">
                                        &ldquo;{entry.note}&rdquo;
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-center text-sm text-gray-500 mt-4">
                Total family moods: {familyMoods.length}
            </div>
        </div>
    )
}
