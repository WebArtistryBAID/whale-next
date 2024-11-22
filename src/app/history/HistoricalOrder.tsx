import {getUploadServePath, HydratedOrder} from '@/app/lib/actions/data-actions'
import {useTranslationClient} from '@/app/i18n/client'
import {useRouter} from 'nextjs-toploader/app'
import {useEffect, useState} from 'react'

export default function HistoricalOrder({order}: { order: HydratedOrder }): JSX.Element {
    const {t} = useTranslationClient('history')
    const router = useRouter()

    const [uploadServePath, setUploadServePath] = useState('')

    useEffect(() => {
        (async () => {
            setUploadServePath(await getUploadServePath())
        })()
    }, [])

    return (
        <button onClick={() => {
            router.push(`/check/${order.id}`)
        }}
                className="bg-accent-yellow-bg hover:bg-accent-orange-bg transition-colors duration-100 rounded-3xl w-full p-4 flex items-center mb-3 text-left h-24">
            <img
                src={`${uploadServePath}/${order.items[0].itemType.image}`}
                alt={order.items[0].itemType.name} className="w-16 h-16 rounded-full object-cover object-center mr-5"/>
            <div className="w-full">
                <p className="text-xl font-bold font-display">{order.number}</p>
                <div className="flex items-center w-full">
                    <p className="text-xs flex-grow mr-2">{t(`status.${order.status.toString()}_${order.type}`)}</p>
                    <p className="flex-shrink font-bold font-display">¥{order.totalPrice}</p>
                </div>
            </div>
        </button>
    )
}
