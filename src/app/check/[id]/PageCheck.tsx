'use client'

import {Trans} from 'react-i18next/TransWithoutContext'
import {QueryClient, QueryClientProvider, useQuery} from '@tanstack/react-query'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCircleCheck, faHourglass, faTriangleExclamation, faTruck} from '@fortawesome/free-solid-svg-icons'
import {faCircleCheck as faCircleCheckR, faHourglass as faHourglassR} from '@fortawesome/free-regular-svg-icons'
import {getOrderTimeEstimate, HydratedOrder, HydratedOrderedItem} from '@/app/lib/actions/data-actions'
import {useState} from 'react'
import {useTranslationClient} from '@/app/i18n/client'
import Loading from '@/app/lib/components/Loading'
import Devastation from '@/app/lib/components/Devastation'
import TopBar from '@/app/lib/components/TopBar'
import {OrderStatus, OrderType} from '@prisma/client'
import IconText from '@/app/lib/components/IconText'
import OrderedItemDetail from '@/app/order/OrderedItem'

const client = new QueryClient()

export default function PageCheckWrapper({order}: { order: HydratedOrder }) {
    return <QueryClientProvider client={client}><PageCheck order={order}/></QueryClientProvider>
}

export function PageCheck({order}: { order: HydratedOrder }): JSX.Element {
    const {t} = useTranslationClient('check')
    const [confirmedRemark, setConfirmedRemark] = useState(false)

    const estimate = useQuery({
        queryKey: ['order-check-estimate', `order-${order.id}`],
        refetchInterval: 10000,
        queryFn: async () => await getOrderTimeEstimate(order.id)
    })

    const now = new Date()
    const productionNotStarted = now.getHours() < 12 || (now.getHours() === 12 && now.getMinutes() < 30)

    if (estimate.isPending) {
        return <Loading screen={true}/>
    }
    if (estimate.isError) {
        return <Devastation screen={true}/>
    }

    return (
        <div>
            <div className="lg:hidden flex flex-col h-screen bg-accent-latte">
                <div className="flex-shrink">
                    <TopBar/>
                </div>

                <div id="main" className="h-full">
                    <div className="flex-grow p-8 pt-16">
                        <div className="flex flex-col items-center">
                            <h1 className="text-6xl font-bold font-display mb-3">{order.number}</h1>
                            {(order.status === OrderStatus.waiting)
                                ? (
                                    productionNotStarted
                                        ? <p className="text-sm mb-5 text-center">
                                            {t('waitingToStart')}
                                        </p>
                                        : <>
                                            <p className="text-sm text-center">
                                                <Trans t={t} i18nKey="estimateOrders" count={estimate.data.orders}
                                                       components={{1: <strong></strong>}}/>
                                            </p>
                                            <p className="text-sm mb-5 text-center">
                                                <Trans t={t} i18nKey="estimateTime" count={estimate.data.time}
                                                       components={{1: <strong></strong>}}/>
                                            </p>
                                        </>
                                )
                                :
                                <p className="text-sm mb-5 text-center">{t(`${order.status}_${order.type}`)}</p>}
                        </div>

                        <div className="flex mb-5 justify-center">
                            <div
                                className={`flex flex-col items-center mr-3 ${order.status !== OrderStatus.waiting ? 'text-gray-400' : 'text-accent-orange'}`}>
                                <FontAwesomeIcon
                                    icon={order.status === OrderStatus.waiting ? faHourglass : faHourglassR}
                                    className="text-4xl mb-1"/>
                                <p className="text-xs text-center">{t('status.waiting_' + order.type)}</p>
                                {order.status === OrderStatus.waiting
                                    ? <p className="w-0 h-0 overflow-hidden">{t('status.current')}</p>
                                    : null}
                            </div>

                            <div
                                className={`flex flex-col items-center ${order.status !== OrderStatus.done ? 'text-gray-400' : 'text-green-400'}`}>
                                <FontAwesomeIcon
                                    icon={order.type === OrderType.delivery ? faTruck : (order.status === OrderStatus.done ? faCircleCheck : faCircleCheckR)}
                                    className="text-4xl mb-1"/>
                                <p className="text-xs text-center">{t('status.done_' + order.type)}</p>
                                {order.status === OrderStatus.done
                                    ? <p className="w-0 h-0 overflow-hidden">{t('status.current')}</p>
                                    : null}
                            </div>
                        </div>

                        <div className="mb-3 w-full">
                            <IconText
                                icon={<FontAwesomeIcon icon={faTriangleExclamation} className="text-yellow-400"/>}>
                                {t('message.orderNumber')}
                            </IconText>
                        </div>

                        <div className="mb-5 w-full">
                            <IconText
                                icon={<FontAwesomeIcon icon={faTriangleExclamation} className="text-yellow-400"/>}>
                                {t('message.pay')}
                            </IconText>
                        </div>

                        <p className="text-gray-400 text-xs mb-2">{t('totalPrice')}</p>
                        <p className="font-display font-bold text-3xl mb-5">¥{order.totalPrice}</p>

                        <p className="text-gray-400 text-xs mb-2">{t('orderType')}</p>
                        <p className="font-display font-bold text-3xl mb-5">{t(`type.${order.type}`)}</p>

                        {order.type === OrderType.delivery
                            ? <p className="text-gray-400 text-xs mb-2">{t('deliveryRoom')}</p>
                            : null}
                        {order.type === OrderType.delivery
                            ? <p className="font-display font-bold text-3xl mb-5">{order.deliveryRoom}</p>
                            : null}

                        <p className="text-gray-400 text-xs mb-2">{t('payQR')}</p>
                        <div className="w-full rounded-3xl mx-auto mb-5 relative">
                            <div className={`z-20 absolute w-full h-full backdrop-blur-lg transition-opacity duration-100 bg-black/50
                                backdrop-filter rounded-3xl flex flex-col justify-center items-center p-5 ${confirmedRemark ? 'opacity-0' : ''}`}>
                                <p className="text-white font-bold text-center text-lg mb-3">{t('payQRNote')}</p>
                                <button onClick={() => {
                                    setConfirmedRemark(true)
                                }}
                                        className="rounded-full py-2 px-5 bg-accent-yellow-bg hover:bg-accent-orange-bg transition-colors duration-100">
                                    {t('confirm')}
                                </button>
                            </div>
                            <img src="/assets/pay-qr.jpg" alt="QR code" className="w-full rounded-3xl"/>
                        </div>

                        <p className="text-gray-400 text-xs mb-2">{t('products')}</p>
                        {order.items.map((item: HydratedOrderedItem) => <OrderedItemDetail key={item.id}
                                                                                           item={item}/>)}
                    </div>
                </div>
            </div>

            <div className="hidden lg:flex h-screen flex-col bg-accent-latte">
                <div className="flex-shrink">
                    <TopBar/>
                </div>
                <div id="main" className="flex flex-grow min-h-0">
                    <div
                        className="w-1/2 border-r border-gray-300 border-solid p-16 h-full overflow-y-auto relative flex flex-col justify-center items-center">
                        <h1 className="text-7xl xl:text-[7rem] font-bold font-display mb-3">{order.number}</h1>
                        {(order.status === OrderStatus.waiting)
                            ? (
                                productionNotStarted
                                    ? <p className="text-xl mb-8 text-center">
                                        {t('waitingToStart')}
                                    </p>
                                    : <>
                                        <p className="text-xl mb-1 text-center">
                                            <Trans t={t} i18nKey="estimateOrders" count={estimate.data.orders}
                                                   components={{1: <strong></strong>}}/>
                                        </p>
                                        <p className="text-xl mb-8 text-center">
                                            <Trans t={t} i18nKey="estimateTime" count={estimate.data.time}
                                                   components={{1: <strong></strong>}}/>
                                        </p>
                                    </>
                            )
                            : <p className="text-xl mb-8 text-center">{t(`${order.status}_${order.type}`)}</p>}

                        <div className="flex mb-8">
                            <div
                                className={`flex flex-col items-center mr-5 ${order.status !== OrderStatus.waiting ? 'text-gray-400' : 'text-accent-orange'}`}>
                                <FontAwesomeIcon
                                    icon={order.status === OrderStatus.waiting ? faHourglass : faHourglassR}
                                    className="text-4xl mb-1"/>
                                <p className="text-sm text-center">{t('status.waiting_' + order.type)}</p>
                                {order.status === OrderStatus.waiting
                                    ? <p className="w-0 h-0 overflow-hidden">{t('status.current')}</p>
                                    : null}
                            </div>

                            <div
                                className={`flex flex-col items-center ${order.status !== OrderStatus.done ? 'text-gray-400' : 'text-green-400'}`}>
                                <FontAwesomeIcon
                                    icon={order.type === OrderType.delivery ? faTruck : (order.status === OrderStatus.done ? faCircleCheck : faCircleCheckR)}
                                    className="text-4xl mb-1"/>
                                <p className="text-sm text-center">{t('status.done_' + order.type)}</p>
                                {order.status === OrderStatus.done
                                    ? <p className="w-0 h-0 overflow-hidden">{t('status.current')}</p>
                                    : null}
                            </div>
                        </div>

                        <div className="w-96">
                            <div className="mb-3">
                                <IconText
                                    icon={<FontAwesomeIcon icon={faTriangleExclamation} className="text-yellow-400"/>}>
                                    {t('message.orderNumber')}
                                </IconText>
                            </div>

                            <div className="mb-3">
                                <IconText
                                    icon={<FontAwesomeIcon icon={faTriangleExclamation} className="text-yellow-400"/>}>
                                    {t('message.pay')}
                                </IconText>
                            </div>
                        </div>
                    </div>
                    <div className="w-1/2 h-full p-8 xl:p-12 2xl:px-24 2xl:py-16 overflow-y-auto">
                        <p className="text-gray-400 text-xs mb-2">{t('totalPrice')}</p>
                        <p className="font-display font-bold text-4xl mb-5">¥{order.totalPrice}</p>

                        <p className="text-gray-400 text-xs mb-2">{t('orderType')}</p>
                        <p className="font-display font-bold text-4xl mb-5">{t(`type.${order.type}`)}</p>

                        {order.type === OrderType.delivery
                            ? <p className="text-gray-400 text-xs mb-2">{t('deliveryRoom')}</p>
                            : null}
                        {order.type === OrderType.delivery
                            ? <p className="font-display font-bold text-4xl mb-5">{order.deliveryRoom}</p>
                            : null}

                        <p className="text-gray-400 text-xs mb-2">{t('payQR')}</p>
                        <div className="w-full xl:w-1/2 rounded-3xl mx-auto mb-5 relative">
                            <div className={`z-20 absolute w-full h-full backdrop-blur-lg transition-opacity duration-100 bg-black/50
                                backdrop-filter rounded-3xl flex flex-col justify-center items-center p-5 ${confirmedRemark ? 'opacity-0' : ''}`}>
                                <p className="text-white font-bold text-center text-lg mb-3">{t('payQRNote')}</p>
                                <button onClick={() => {
                                    setConfirmedRemark(true)
                                }}
                                        className="rounded-full py-2 px-5 bg-accent-yellow-bg hover:bg-accent-orange-bg transition-colors duration-100">
                                    {t('confirm')}
                                </button>
                            </div>
                            <img src="/assets/pay-qr.jpg" alt="QR code" className="w-full rounded-3xl"/>
                        </div>

                        <p className="text-gray-400 text-xs mb-2">{t('products')}</p>
                        {order.items.map((item: HydratedOrderedItem) => <OrderedItemDetail key={item.id}
                                                                                           item={item}/>)}
                    </div>
                </div>
            </div>
        </div>
    )
}
