'use client'

import { useState, useEffect } from 'react'
import type { MoodOption, MoodIntensity } from './types/mood'
import type { User } from './types/user'
import LoginModal from './components/LoginModal'
import FamilyMoodFeed from './components/FamilyMoodFeed'

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
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [showLoginModal, setShowLoginModal] = useState(false)
    const [selectedMood, setSelectedMood] = useState<string>('')
    const [moodIntensity, setMoodIntensity] = useState<MoodIntensity>('medium')
    const [moodNote, setMoodNote] = useState<string>('')
    const [showSuccess, setShowSuccess] = useState(false)

    // Check if user is already logged in (from localStorage)
    useEffect(() => {
        const savedUser = localStorage.getItem('moods-current-user')
        if (savedUser) {
            try {
                const user = JSON.parse(savedUser)
                // Convert timestamp back to Date
                user.createdAt = new Date(user.createdAt)
                setCurrentUser(user)
            } catch (error) {
                console.error('Error loading saved user:', error)
                localStorage.removeItem('moods-current-user')
            }
        } else {
            setShowLoginModal(true)
        }
    }, [])

    const handleLogin = (user: User) => {
        setCurrentUser(user)
        localStorage.setItem('moods-current-user', JSON.stringify(user))
        setShowLoginModal(false)
    }

    const handleLogout = () => {
        setCurrentUser(null)
        localStorage.removeItem('moods-current-user')
        setShowLoginModal(true)
    }

    const logMood = async () => {
        if (!selectedMood || !currentUser) return

        const newMood = {
            userId: currentUser.id,
            userName: currentUser.name,
            userIcon: currentUser.icon,
            userColor: currentUser.color,
            mood: selectedMood,
            intensity: moodIntensity,
            note: moodNote.trim() || undefined,
        }

        try {
            const response = await fetch('/api/moods', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newMood),
            })

            const data = await response.json()

            if (data.success) {
                setSelectedMood('')
                setMoodIntensity('medium')
                setMoodNote('')
                setShowSuccess(true)

                // Hide success message after 2 seconds
                setTimeout(() => setShowSuccess(false), 2000)
            } else {
                alert('Failed to log mood. Please try again.')
            }
        } catch {
            alert('Network error. Please try again.')
        }
    }

    if (!currentUser) {
        return (
            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onLogin={handleLogin}
            />
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
            <div className="max-w-md mx-auto">
                {/* Header with User Info */}
                <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div
                            className="text-4xl p-3 rounded-full"
                            style={{
                                backgroundColor: `${currentUser.color}20`,
                            }}
                        >
                            {currentUser.icon}
                        </div>
                        <div className="text-left">
                            <div className="text-lg font-semibold text-gray-800">
                                Hi, {currentUser.name}!
                            </div>
                            <button
                                onClick={handleLogout}
                                className="text-sm text-blue-500 hover:text-blue-700"
                            >
                                Switch User
                            </button>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        How are you feeling?
                    </h1>
                    <p className="text-gray-600">Tap on a mood to log it!</p>
                </div>

                {/* Mood Selection */}
                <div className="grid grid-cols-2 gap-4 mb-6">
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

                {/* Mood Logging Form */}
                {selectedMood && (
                    <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            How {selectedMood.toLowerCase()} are you feeling?
                        </h3>

                        {/* Intensity Selection */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Intensity Level
                            </label>
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
                        </div>

                        {/* Optional Note */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Add a note (optional)
                            </label>
                            <textarea
                                value={moodNote}
                                onChange={(e) => setMoodNote(e.target.value)}
                                placeholder="Why are you feeling this way?"
                                className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
                                rows={2}
                                maxLength={200}
                            />
                            <div className="text-right text-xs text-gray-500 mt-1">
                                {moodNote.length}/200
                            </div>
                        </div>

                        {/* Log Button */}
                        <button
                            onClick={logMood}
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
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

                {/* Family Mood Feed */}
                <FamilyMoodFeed currentUserId={currentUser.id} />
            </div>
        </div>
    )
}
