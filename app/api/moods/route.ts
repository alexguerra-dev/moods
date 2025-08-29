import { NextRequest, NextResponse } from 'next/server'
import type { MoodEntryWithUser } from '../../types/user'

// Mock database for moods - in production, this would be a real database
let MOODS_DATABASE: MoodEntryWithUser[] = []

// GET /api/moods - Get all family moods
export async function GET() {
    try {
        // Sort by timestamp, newest first
        const sortedMoods = [...MOODS_DATABASE].sort(
            (a, b) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime(),
        )

        return NextResponse.json({
            success: true,
            moods: sortedMoods,
        })
    } catch {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch moods' },
            { status: 500 },
        )
    }
}

// POST /api/moods - Create a new mood entry
export async function POST(request: NextRequest) {
    try {
        const { userId, userName, userIcon, userColor, mood, intensity, note } =
            await request.json()

        const newMood: MoodEntryWithUser = {
            id: Date.now().toString(),
            userId,
            userName,
            userIcon,
            userColor,
            mood,
            intensity,
            note,
            timestamp: new Date(),
        }

        MOODS_DATABASE.push(newMood)

        return NextResponse.json({
            success: true,
            mood: newMood,
        })
    } catch {
        return NextResponse.json(
            { success: false, error: 'Failed to create mood' },
            { status: 500 },
        )
    }
}

// DELETE /api/moods - Clear all moods (for testing/reset)
export async function DELETE() {
    try {
        MOODS_DATABASE = []
        return NextResponse.json({
            success: true,
            message: 'All moods cleared',
        })
    } catch {
        return NextResponse.json(
            { success: false, error: 'Failed to clear moods' },
            { status: 500 },
        )
    }
}
