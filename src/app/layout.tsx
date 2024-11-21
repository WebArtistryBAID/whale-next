import type {Metadata} from 'next'
import {Lora, Noto_Sans_SC} from 'next/font/google'
import './globals.css'
import NextTopLoader from 'nextjs-toploader'

import {config} from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'

config.autoAddCss = false

const lora = Lora({
    subsets: ['latin', 'latin-ext'],
    variable: '--font-inter'
})

const notoSans = Noto_Sans_SC({
    subsets: ['latin', 'latin-ext'],
    variable: '--font-noto-sans-sc'
})

export const metadata: Metadata = {
    title: 'Whale Cafe',
    description: 'Ordering system for Whale Cafe'
}

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${lora.variable} ${notoSans.variable} antialiased`}
        >
        <NextTopLoader/>
        {children}
        </body>
        </html>
    )
}
