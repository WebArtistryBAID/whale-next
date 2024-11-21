'use client'

import {useTranslationClient} from '@/app/i18n/client'
import {useCookies} from 'react-cookie'
import {useRouter} from 'next/navigation'
import {useQuery} from '@tanstack/react-query'
import {getOrder, getOrderTimeEstimate} from '@/app/lib/actions/data-actions'
import Loading from '@/app/lib/components/Loading'
import {Trans} from 'react-i18next/TransWithoutContext'
import {OrderStatus, OrderType} from '@prisma/client'
import {ReactNode} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCircleCheck, faHourglass, faTruck} from '@fortawesome/free-solid-svg-icons'

export default function HomeStatus() {
    const {t} = useTranslationClient('home')
    const [cookies, setCookies] = useCookies()
    const router = useRouter()

    if (!('current-order' in cookies)) {
        return <div></div>
    }

    const order = useQuery({
        queryKey: ['order', `id-${cookies['current-order']}`],
        queryFn: async () => await getOrder(parseInt(cookies['current-order']))
    })

    const orderEstimate = useQuery({
        queryKey: ['order-estimate-for-id', `id-${cookies['current-order']}`],
        queryFn: async () => await getOrderTimeEstimate(parseInt(cookies['current-order'])),
        refetchInterval: 10000
    })

    if (orderEstimate.isPending || order.isPending) {
        return <div className="min-w-80"><Loading/></div>
    }
    if (orderEstimate.isError || order.isError || order.data == null) {
        setCookies('current-order', '')
        return <div></div>
    }

    return (
        <button
            className="block text-left hover:bg-gray-100 transition-colors duration-100 h-full rounded-3xl p-5 lg:p-7 xl:p-8 w-full"
            onClick={() => router.push(`/check/${parseInt(cookies['current-order'])}`)}>
            <div className="flex items-center">
                <div className="flex-grow mr-3 lg:mr-5 xl:mr-8">
                    <p className="text-xs lg:text-sm text-gray-400 lg:mb-1">
                        {t('currentOrderCard.name')}
                    </p>
                    <p className="text-3xl lg:text-5xl font-display font-bold lg:mb-1">
                        {order.data!.number}
                    </p>
                    <p className="text-xs lg:text-sm">
                        <Trans
                            i18nKey={'currentOrderCard.' + order.data!.status.toString() + '_' + order.data!.type.toString()}
                            count={orderEstimate.data} t={t}
                            components={{1: <strong></strong>}}/>
                    </p>
                </div>
                <div className="flex-shrink">
                    {
                        new Map<OrderStatus, ReactNode>([
                            [OrderStatus.done,
                                // eslint-disable-next-line react/jsx-key
                                <FontAwesomeIcon
                                    icon={order.data!.type === OrderType.delivery ? faTruck : faCircleCheck}
                                    className="text-5xl lg:text-7xl text-green-400"/>],
                            [OrderStatus.waiting,
                                // eslint-disable-next-line react/jsx-key
                                <FontAwesomeIcon icon={faHourglass}
                                                 className="text-5xl lg:text-7xl text-accent-orange"/>]
                        ]).get(order.data!.status)
                    }
                </div>
            </div>
        </button>
    )
}
