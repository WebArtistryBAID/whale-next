'use client'

import FullScreenDetail from './FullScreenDetail'

export default function FullScreenMessage({title, description}: { title: string, description: string }) {
    return <FullScreenDetail title={title}>
        <p className="text-sm">
            {description}
        </p>
    </FullScreenDetail>
}
