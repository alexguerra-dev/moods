import { NextRequest, NextResponse } from 'next/server'
import { supabase, TABLES } from '../../config/supabase'
import type { User, FamilyMember } from '../../types/user'

// Fallback data when Supabase is not configured
const FALLBACK_USERS: User[] = [
    {
        id: '1',
        name: 'Alex',
        icon: '👨‍💻',
        pin: '1234',
        color: '#3B82F6',
        isActive: true,
        createdAt: new Date('2024-01-01'),
    },
    {
        id: '2',
        name: 'Sarah',
        icon: '👩‍🎨',
        pin: '5678',
        color: '#EC4899',
        isActive: true,
        createdAt: new Date('2024-01-01'),
    },
    {
        id: '3',
        name: 'Emma',
        icon: '👧',
        pin: '1111',
        color: '#10B981',
        isActive: true,
        createdAt: new Date('2024-01-01'),
    },
    {
        id: '4',
        name: 'Liam',
        icon: '👦',
        pin: '2222',
        color: '#F59E0B',
        isActive: true,
        createdAt: new Date('2024-01-01'),
    },
]

// GET /api/users - Get all family members (without sensitive data)
export async function GET() {
    try {
        // If Supabase is not configured, use fallback data
        if (!supabase) {
            console.warn('Using fallback user data - Supabase not configured')
            const familyMembers: FamilyMember[] = FALLBACK_USERS.filter(
                (user) => user.isActive,
            ).map((user) => ({
                id: user.id,
                name: user.name,
                icon: user.icon,
                color: user.color,
            }))

            return NextResponse.json({
                success: true,
                familyMembers,
            })
        }

        const { data: users, error } = await supabase
            .from(TABLES.USERS)
            .select('id, name, icon, color')
            .eq('is_active', true)
            .order('name')

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json(
                { success: false, error: 'Failed to fetch family members' },
                { status: 500 },
            )
        }

        const familyMembers: FamilyMember[] = users.map((user) => ({
            id: user.id,
            name: user.name,
            icon: user.icon,
            color: user.color,
        }))

        return NextResponse.json({
            success: true,
            familyMembers,
        })
    } catch {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch family members' },
            { status: 500 },
        )
    }
}

// POST /api/users/login - Authenticate user
export async function POST(request: NextRequest) {
    try {
        const { userId, pin } = await request.json()

        // If Supabase is not configured, use fallback data
        if (!supabase) {
            console.warn(
                'Using fallback user authentication - Supabase not configured',
            )
            const user = FALLBACK_USERS.find(
                (u) => u.id === userId && u.pin === pin,
            )

            if (!user) {
                return NextResponse.json(
                    { success: false, error: 'Invalid credentials' },
                    { status: 401 },
                )
            }

            // Return user data without the PIN
            const { pin: _unused, ...safeUser } = user

            return NextResponse.json({
                success: true,
                user: safeUser,
            })
        }

        const { data: user, error } = await supabase
            .from(TABLES.USERS)
            .select('*')
            .eq('id', userId)
            .eq('pin', pin)
            .eq('is_active', true)
            .single()

        if (error || !user) {
            return NextResponse.json(
                { success: false, error: 'Invalid credentials' },
                { status: 401 },
            )
        }

        // Return user data without the PIN
        const { pin: _unused, ...safeUser } = user

        return NextResponse.json({
            success: true,
            user: safeUser,
        })
    } catch {
        return NextResponse.json(
            { success: false, error: 'Login failed' },
            { status: 500 },
        )
    }
}
