export interface User {
    id: string
    name: string
    icon: string
    pin: string
    color: string
    isActive: boolean
    createdAt: Date
}

export interface FamilyMember {
    id: string
    name: string
    icon: string
    color: string
    isOnline?: boolean
}

export interface LoginCredentials {
    userId: string
    pin: string
}

export interface AuthState {
    isAuthenticated: boolean
    currentUser: User | null
    familyMembers: FamilyMember[]
}

export interface MoodEntryWithUser {
    id: string
    userId: string
    userName: string
    userIcon: string
    userColor: string
    mood: string
    timestamp: Date | string
    intensity?: 'low' | 'medium' | 'high'
    note?: string
}
