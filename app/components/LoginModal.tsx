'use client'

import { useState, useEffect } from 'react'
import type { FamilyMember, User, LoginCredentials } from '../types/user'

interface LoginModalProps {
    isOpen: boolean
    onClose: () => void
    onLogin: (user: User) => void
}

export default function LoginModal({
    isOpen,
    onClose,
    onLogin,
}: LoginModalProps) {
    const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
    const [selectedUserId, setSelectedUserId] = useState<string>('')
    const [pin, setPin] = useState<string>('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string>('')
    const [isLoadingMembers, setIsLoadingMembers] = useState(true)

    // Load family members on component mount
    useEffect(() => {
        if (isOpen) {
            loadFamilyMembers()
        }
    }, [isOpen])

    const loadFamilyMembers = async () => {
        try {
            setIsLoadingMembers(true)
            const response = await fetch('/api/users')
            const data = await response.json()

            if (data.success) {
                setFamilyMembers(data.familyMembers)
            } else {
                setError('Failed to load family members')
            }
        } catch {
            setError('Network error loading family members')
        } finally {
            setIsLoadingMembers(false)
        }
    }

    const handleLogin = async () => {
        if (!selectedUserId || pin.length !== 4) {
            setError('Please select a family member and enter a 4-digit PIN')
            return
        }

        setIsLoading(true)
        setError('')

        try {
            const credentials: LoginCredentials = {
                userId: selectedUserId,
                pin: pin,
            }

            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            })

            const data = await response.json()

            if (data.success) {
                onLogin(data.user)
                onClose()
            } else {
                setError(data.error || 'Login failed')
            }
        } catch {
            setError('Network error during login')
        } finally {
            setIsLoading(false)
        }
    }

    const handlePinInput = (value: string) => {
        // Only allow numbers and limit to 4 digits
        const numericValue = value.replace(/\D/g, '').slice(0, 4)
        setPin(numericValue)

        // Auto-submit when 4 digits are entered
        if (numericValue.length === 4) {
            handleLogin()
        }
    }

    if (!isOpen) return null

    const selectedMember = familyMembers.find((m) => m.id === selectedUserId)

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Welcome to Moods!
                    </h2>
                    <p className="text-gray-600">
                        Choose your family member and enter your PIN
                    </p>
                </div>

                {/* Family Member Selection */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Who are you?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {familyMembers.map((member) => (
                            <button
                                key={member.id}
                                onClick={() => setSelectedUserId(member.id)}
                                className={`${member.color} ${
                                    selectedUserId === member.id
                                        ? 'ring-4 ring-blue-300'
                                        : ''
                                } p-4 rounded-2xl border-2 transition-all`}
                            >
                                <div className="text-3xl mb-2">
                                    {member.icon}
                                </div>
                                <div className="text-white font-bold text-lg">
                                    {member.name}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* PIN Input */}
                {selectedUserId && (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Enter your 4-digit PIN
                        </label>
                        <div className="flex gap-2">
                            {[0, 1, 2, 3].map((index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength={1}
                                    value={pin[index] || ''}
                                    onChange={(e) => {
                                        const newPin = pin.split('')
                                        newPin[index] = e.target.value
                                        handlePinInput(newPin.join(''))
                                    }}
                                    className="w-16 h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                                    style={{ caretColor: 'transparent' }}
                                />
                            ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            PIN:{' '}
                            {selectedMember?.name === 'Alex'
                                ? '1234'
                                : selectedMember?.name === 'Sarah'
                                ? '5678'
                                : selectedMember?.name === 'Emma'
                                ? '1111'
                                : selectedMember?.name === 'Liam'
                                ? '2222'
                                : '????'}
                        </p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleLogin}
                        disabled={
                            !selectedUserId || pin.length !== 4 || isLoading
                        }
                        className="flex-1 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </div>

                {/* Loading State */}
                {isLoadingMembers && (
                    <div className="text-center py-4">
                        <div className="text-gray-500">
                            Loading family members...
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
