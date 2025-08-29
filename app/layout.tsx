import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'Moods',
    description:
        'Moods is a simple, intuitive web app for tracking your daily emotions. Log moods, discover patterns, and gain insights to boost well-being. Stay mindful and improve mental health with personalized mood journaling.',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}
