import {useEffect, useRef, useState} from 'react'
import {getUploadServePath} from '@/app/lib/actions/data-actions'
import {Ad} from '@prisma/client'

export default function Ads({ads}: { ads: Ad[] }) {
    const [index, setIndex] = useState(0)
    const [uploadServePath, setUploadServePath] = useState('')
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    function resetTimeout(): void {
        if (timeoutRef.current != null) {
            clearTimeout(timeoutRef.current)
        }
    }

    useEffect(() => {
        (async () => {
            setUploadServePath(await getUploadServePath())
        })()
    }, [])

    useEffect(() => {
        resetTimeout()
        timeoutRef.current = setTimeout(
            () => {
                setIndex((prevIndex) => prevIndex === ads.length - 1 ? 0 : prevIndex + 1)
            },
            10000
        )
    }, [index])

    return (
        <div className="w-full h-full rounded-3xl relative overflow-clip">
            <div className="whitespace-nowrap transition-all duration-500 ease-in-out h-full"
                 style={{transform: `translate3d(${-index * 100}%, 0, 0)`}}>
                {ads.map((ad, index) =>
                    <a href={ad.url} target="_blank" className="h-full w-full" rel="noreferrer" key={index}>
                        <img className="inline-block h-full object-cover w-full "
                             src={`${uploadServePath}/${ad.image}`}
                             alt={ad.name}/>
                    </a>)}
            </div>

            <div className="absolute w-full bottom-0 text-center p-3">
                {ads.map((_, current) =>
                    <button key={current} onClick={() => {
                        setIndex(current)
                    }}
                            className={'inline-block lg:h-3 lg:w-3 w-2 h-2 mx-1 rounded-full transition-colors duration-100 ' +
                                ((current === index) ? 'bg-white/50' : 'bg-gray-300/50')}>
                        <p className="text-[0]">Advertisement {current}</p>
                    </button>
                )}
            </div>
        </div>
    )
}
