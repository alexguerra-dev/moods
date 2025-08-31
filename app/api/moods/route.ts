import { NextRequest, NextResponse } from 'next/server'
import { supabase, TABLES } from '../../config/supabase'
import type { MoodEntryWithUser } from '../../types/user'

// Fallback storage when Supabase is not configured
let FALLBACK_MOODS: MoodEntryWithUser[] = []

// GET /api/moods - Get all family moods
export async function GET() {
    try {
        // If Supabase is not configured, use fallback data
        if (!supabase) {
            console.warn('Using fallback mood data - Supabase not configured')
            return NextResponse.json({
                success: true,
                moods: FALLBACK_MOODS,
            })
        }

        const { data: moods, error } = await supabase
            .from(TABLES.MOODS)
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json(
                { success: false, error: 'Failed to fetch moods' },
                { status: 500 },
            )
        }

        // Convert database format to our app format
        const formattedMoods: MoodEntryWithUser[] = moods.map((mood) => {
            // Ensure we create a valid Date object
            let timestamp: Date | string
            try {
                const dateObj = new Date(mood.created_at)
                timestamp = isNaN(dateObj.getTime()) ? mood.created_at : dateObj
            } catch {
                timestamp = mood.created_at
            }

            return {
                id: mood.id,
                userId: mood.user_id,
                userName: mood.user_name,
                userIcon: mood.user_icon,
                userColor: mood.user_color,
                mood: mood.mood,
                intensity: mood.intensity,
                note: mood.note,
                timestamp,
            }
        })

        return NextResponse.json({
            success: true,
            moods: formattedMoods,
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

        // If Supabase is not configured, use fallback storage
        if (!supabase) {
            console.warn(
                'Using fallback mood storage - Supabase not configured',
            )
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

            FALLBACK_MOODS.unshift(newMood)

            return NextResponse.json({
                success: true,
                mood: newMood,
            })
        }

        const newMood = {
            user_id: userId,
            user_name: userName,
            user_icon: userIcon,
            user_color: userColor,
            mood,
            intensity,
            note: note || null,
        }

        const { data: insertedMood, error } = await supabase
            .from(TABLES.MOODS)
            .insert(newMood)
            .select()
            .single()

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json(
                { success: false, error: 'Failed to create mood' },
                { status: 500 },
            )
        }

        // Convert back to our app format
        const formattedMood: MoodEntryWithUser = {
            id: insertedMood.id,
            userId: insertedMood.user_id,
            userName: insertedMood.user_name,
            userIcon: insertedMood.user_icon,
            userColor: insertedMood.user_color,
            mood: insertedMood.mood,
            intensity: insertedMood.intensity,
            note: insertedMood.note,
            timestamp: insertedMood.created_at
                ? new Date(insertedMood.created_at)
                : new Date(),
        }

        return NextResponse.json({
            success: true,
            mood: formattedMood,
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
        // If Supabase is not configured, use fallback storage
        if (!supabase) {
            console.warn(
                'Using fallback mood storage - Supabase not configured',
            )
            FALLBACK_MOODS = []
            return NextResponse.json({
                success: true,
                message: 'All moods cleared',
            })
        }

        const { error } = await supabase
            .from(TABLES.MOODS)
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all rows

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json(
                { success: false, error: 'Failed to clear moods' },
                { status: 500 },
            )
        }

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
