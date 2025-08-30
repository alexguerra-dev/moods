import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'Moods - Track Your Feelings',
    description:
        'A simple, kid-friendly app for tracking daily emotions. Log moods with one tap and see your mood patterns.',
    keywords: [
        'mood tracking',
        'emotions',
        'mental health',
        'kids',
        'wellness',
    ],
    authors: [{ name: 'Lovely Vector' }],
    manifest: '/manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Moods',
    },
    openGraph: {
        title: 'Moods - Track Your Feelings',
        description: 'A simple, kid-friendly app for tracking daily emotions.',
        type: 'website',
        url: 'https://moods.lovelyvector.com/',
    },
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: '#3B82F6',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <head>
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta
                    name="apple-mobile-web-app-status-bar-style"
                    content="default"
                />
                <meta name="apple-mobile-web-app-title" content="Moods" />
                <meta name="mobile-web-app-capable" content="yes" />
                <link rel="apple-touch-icon" href="/icon-192x192.svg" />
                <link
                    rel="icon"
                    type="image/svg+xml"
                    sizes="192x192"
                    href="/icon-192x192.svg"
                />
                <link
                    rel="icon"
                    type="image/svg+xml"
                    sizes="512x512"
                    href="/icon-512x512.svg"
                />
            </head>
            <body className="antialiased">{children}</body>
        </html>
    )
}
