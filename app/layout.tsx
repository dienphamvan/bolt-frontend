import type React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { Toaster } from '@/components/ui/toaster'
import { Suspense } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Car Rental Barcelona',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang='en' suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider
                    attribute='class'
                    defaultTheme='system'
                    enableSystem
                    disableTransitionOnChange
                >
                    <div className='absolute top-4 right-4'>
                        <ThemeToggle />
                    </div>
                    <Suspense>
                        <div className='min-h-screen bg-background'>
                            <div className='container mx-auto px-4 py-8'>
                                {children}
                            </div>

                            <Toaster />
                        </div>
                    </Suspense>
                </ThemeProvider>
            </body>
        </html>
    )
}
