'use client'

import {ShoppingCartProvider} from '@/app/lib/provider/shopping-cart'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

export default function OrderLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const queryClient = new QueryClient()

    return (
        <QueryClientProvider client={queryClient}>
            <ShoppingCartProvider>
                {children}
            </ShoppingCartProvider>
        </QueryClientProvider>
    )
}
