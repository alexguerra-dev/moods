import { NextRequest, NextResponse } from 'next/server'
import type { User, FamilyMember } from '../../types/user'

// Mock database - in production, this would be a real database
const FAMILY_USERS: User[] = [
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
        const familyMembers: FamilyMember[] = FAMILY_USERS.filter(
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

        const user = FAMILY_USERS.find((u) => u.id === userId && u.pin === pin)

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
    } catch {
        return NextResponse.json(
            { success: false, error: 'Login failed' },
            { status: 500 },
        )
    }
}
