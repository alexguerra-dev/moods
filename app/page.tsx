'use client'

import { useState, useEffect } from 'react'
import type { MoodEntry, MoodOption, MoodIntensity } from './types/mood'
import { formatTime, formatDate } from './utils/dateUtils'
import {
    loadMoodHistory,
    saveMoodHistory,
    clearMoodHistory,
    getMoodStats,
} from './utils/storage'

const MOODS: MoodOption[] = [
    { name: 'Happy', emoji: '😊', color: 'bg-yellow-400 hover:bg-yellow-500' },
    { name: 'Sad', emoji: '😢', color: 'bg-blue-400 hover:bg-blue-500' },
    { name: 'Angry', emoji: '😠', color: 'bg-red-400 hover:bg-red-500' },
    { name: 'Calm', emoji: '😌', color: 'bg-green-400 hover:bg-green-500' },
    { name: 'Excited', emoji: '🤩', color: 'bg-pink-400 hover:bg-pink-500' },
    { name: 'Tired', emoji: '😴', color: 'bg-purple-400 hover:bg-purple-500' },
    { name: 'Hungry', emoji: '🤤', color: 'bg-orange-400 hover:bg-orange-500' },
]

export default function Home() {
    const [selectedMood, setSelectedMood] = useState<string>('')
    const [moodIntensity, setMoodIntensity] = useState<MoodIntensity>('medium')
    const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([])
    const [showSuccess, setShowSuccess] = useState(false)

    // Load mood history from localStorage on component mount
    useEffect(() => {
        const savedMoods = loadMoodHistory()
        setMoodHistory(savedMoods)
    }, [])

    // Save mood history to localStorage whenever it changes
    useEffect(() => {
        saveMoodHistory(moodHistory)
    }, [moodHistory])

    const logMood = () => {
        if (!selectedMood) return

        const newMood: MoodEntry = {
            id: Date.now().toString(),
            mood: selectedMood,
            timestamp: new Date(),
            intensity: moodIntensity,
        }

        setMoodHistory((prev) => [newMood, ...prev])
        setSelectedMood('')
        setShowSuccess(true)

        // Hide success message after 2 seconds
        setTimeout(() => setShowSuccess(false), 2000)
    }

    const handleClearHistory = () => {
        if (confirm('Are you sure you want to clear all your mood history?')) {
            setMoodHistory([])
            clearMoodHistory()
        }
    }

    const moodStats = getMoodStats(moodHistory)

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        How are you feeling?
                    </h1>
                    <p className="text-gray-600">Tap on a mood to log it!</p>
                </div>

                {/* Quick Stats */}
                {moodHistory.length > 0 && (
                    <div className="bg-white rounded-2xl p-4 shadow-lg mb-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                                {moodStats.totalEntries}
                            </div>
                            <div className="text-sm text-gray-600">
                                Total Moods Logged
                            </div>
                        </div>
                    </div>
                )}

                {/* Mood Selection */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    {MOODS.map((mood) => (
                        <button
                            key={mood.name}
                            onClick={() => setSelectedMood(mood.name)}
                            className={`${mood.color} ${
                                selectedMood === mood.name
                                    ? 'ring-4 ring-blue-300'
                                    : ''
                            } p-6 rounded-2xl shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95`}
                        >
                            <div className="text-4xl mb-2">{mood.emoji}</div>
                            <div className="text-white font-bold text-lg">
                                {mood.name}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Intensity Selection */}
                {selectedMood && (
                    <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            How {selectedMood.toLowerCase()} are you feeling?
                        </h3>
                        <div className="flex gap-3">
                            {(['low', 'medium', 'high'] as const).map(
                                (intensity) => (
                                    <button
                                        key={intensity}
                                        onClick={() =>
                                            setMoodIntensity(intensity)
                                        }
                                        className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
                                            moodIntensity === intensity
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {intensity.charAt(0).toUpperCase() +
                                            intensity.slice(1)}
                                    </button>
                                ),
                            )}
                        </div>
                        <button
                            onClick={logMood}
                            className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                        >
                            Log My Mood! 🎉
                        </button>
                    </div>
                )}

                {/* Success Message */}
                {showSuccess && (
                    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg z-50">
                        Mood logged successfully! 🎉
                    </div>
                )}

                {/* Mood History */}
                {moodHistory.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Recent Moods
                            </h3>
                            <button
                                onClick={handleClearHistory}
                                className="text-sm text-red-500 hover:text-red-700"
                            >
                                Clear All
                            </button>
                        </div>
                        <div className="space-y-3">
                            {moodHistory.slice(0, 10).map((entry) => (
                                <div
                                    key={entry.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">
                                            {
                                                MOODS.find(
                                                    (m) =>
                                                        m.name === entry.mood,
                                                )?.emoji
                                            }
                                        </span>
                                        <div>
                                            <div className="font-medium text-gray-800">
                                                {entry.mood}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {entry.intensity} intensity •{' '}
                                                {formatTime(entry.timestamp)} •{' '}
                                                {formatDate(entry.timestamp)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {moodHistory.length > 10 && (
                            <p className="text-center text-sm text-gray-500 mt-3">
                                Showing last 10 moods • Total:{' '}
                                {moodHistory.length}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
