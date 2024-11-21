import {useTranslation} from '@/app/i18n'
import Image from 'next/image'
import {Trans} from 'react-i18next'
import {requireLogin} from '@/app/login/login'
import {redirect} from 'next/navigation'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faClock, faMugHot, faUser} from '@fortawesome/free-solid-svg-icons'
import {useTranslationClient} from '@/app/i18n/client'

async function ComponentAccountButton() {
    const {t} = await useTranslation('home')

    return (
        <button className="flex justify-center items-center flex-col rounded-3xl w-full h-full
                            px-3 py-5 bg-white hover:bg-gray-100 transition-colors duration-100"
                onClick={() => {
                    requireLogin()
                    redirect('/account')
                }}>
            <FontAwesomeIcon icon={faUser} className="text-blue-500 mb-3 text-5xl"/>

            <p className="font-bold text-xl font-display mb-0.5">
                {t('account.name')}
            </p>

            <p className="text-gray-400 text-xs">
                {t('account.description')}
            </p>
        </button>
    )
}

function ComponentHomeStatus() {
    'use client'
    const {t} = useTranslationClient('home')

    const order = useQuery({
        queryKey: ['order-estimate-for-id', `id-${persistentStorage.getCurrentOrder()}`],
        queryFn: async () =>
            (persistentStorage.getCurrentOrder() == null ? null : await getOrderTimeEstimate(persistentStorage.getCurrentOrder() as number)),
        refetchInterval: 10000
    })

    if (persistentStorage.getCurrentOrder() == null) {
        return <div></div>
    }

    if (order.isPending || order.data == null) {
        return <div className="min-w-80"><ComponentLoading/></div>
    }

    if (order.isError && 'detail' in order.data && order.data.detail === 'Not Found') {
        persistentStorage.setCurrentOrder(null)
        return <div className="min-w-80"><ComponentLoading/></div>
    }

    if (order.isError || 'detail' in order.data) {
        if ('detail' in order.data && order.data.detail === 'Not Found') {
            setTimeout(() => {
                persistentStorage.setCurrentOrder(null)
            }, 500)
        }
        return <div className="min-w-80"><ComponentError detail={order}/></div>
    }

    function navigateTo(): void {
        if (persistentStorage.getCurrentOrder() == null) {
            return
        }
        navigate(`/check/${persistentStorage.getCurrentOrder()}`)
    }

    return (
        <button
            className="block text-left hover:bg-gray-100 transition-colors duration-100 h-full rounded-3xl p-5 lg:p-7 xl:p-8 w-full"
            onClick={navigateTo}>
            <div className="flex items-center">
                <div className="flex-grow mr-3 lg:mr-5 xl:mr-8">
                    <p className="text-xs lg:text-sm text-gray-400 lg:mb-1">
                        {t('currentOrderCard.name')}
                    </p>
                    <p className="text-3xl lg:text-5xl font-display font-bold lg:mb-1">
                        {order.data.number!}
                    </p>
                    <p className="text-xs lg:text-sm">
                        <Trans i18nKey={'currentOrderCard.' + order.data.status! + '_' + order.data.type}
                               count={order.data.time}
                               components={{1: <strong></strong>}}/>
                    </p>
                </div>
                <div className="flex-shrink">
                    {
                        new Map<OrderStatus, JSX.Element>([
                            [OrderStatus.done,
                                // eslint-disable-next-line react/jsx-key
                                <FontAwesomeIcon icon={order.data.type === OrderType.delivery ? faTruck : faCircleCheck}
                                                 className="text-5xl lg:text-7xl text-green-400"/>],
                            [OrderStatus.waiting,
                                // eslint-disable-next-line react/jsx-key
                                <FontAwesomeIcon icon={faHourglass}
                                                 className="text-5xl lg:text-7xl text-accent-orange"/>]
                        ]).get(order.data.status!)
                    }
                </div>
            </div>
        </button>
    )
}

async function ComponentPickupButton() {
    const {t} = await useTranslation('home')

    return (
        <button className="flex justify-center items-center flex-col rounded-3xl w-full h-full
                            px-3 py-5 bg-white hover:bg-gray-100 transition-colors duration-100"
                onClick={() => {
                    requireLogin()
                    redirect('/order')
                }}>
            <FontAwesomeIcon icon={faMugHot} className="text-accent-red mb-3 text-5xl"/>

            <p className="font-bold text-xl font-display mb-0.5">
                {t('pickUp.name')}
            </p>

            <p className="text-gray-400 text-xs">
                {t('pickUp.description')}
            </p>
        </button>
    )
}

async function ComponentHistoryButton() {
    const {t} = await useTranslation('home')

    return (
        <button className="flex justify-center items-center flex-col rounded-3xl w-full h-full
                            px-3 py-5 bg-white hover:bg-gray-100 transition-colors duration-100"
                onClick={() => {
                    requireLogin()
                    redirect('/history')
                }}>
            <FontAwesomeIcon icon={faClock} className="text-accent-orange mb-3 text-5xl"/>

            <p className="font-bold text-xl font-display mb-0.5">
                {t('history.name')}
            </p>

            <p className="text-gray-400 text-xs">
                {t('history.description')}
            </p>
        </button>
    )
}

export default async function PageHome() {
    const {t} = await useTranslation('home')

    return (
        <div>
            <div className="block lg:hidden h-screen bg-accent-latte">
                <div className="top-0 left-0 absolute h-[50vh] bg-cover w-full"
                     style={{backgroundImage: `url(/assets/mobile-decoration.webp)`}}></div>
                <div className="w-full px-3 translate-y-[40vh] flex justify-center items-center flex-col">
                    <div
                        className="grid grid-cols-2 grid-rows-1 place-content-center w-full bg-white rounded-3xl shadow-xl p-8 mb-5">
                        <ComponentPickupButton/>
                        <ComponentHistoryButton/>
                    </div>

                    <div className="bg-white rounded-3xl shadow-md w-full">
                        <ComponentHomeStatus/>
                    </div>
                </div>
                <ComponentBottomNav/>
            </div>

            <div className="hidden lg:block bg-accent-latte">
                <div className="absolute select-none w-screen top-0 left-0 h-[30vh] flex justify-center items-center"
                     aria-hidden={true}>
                    <p className="text-[7rem] xl:text-[10rem] bg-clip-text text-transparent from-[#401f1022] to-[#401f1000] bg-gradient-to-b
                                    font-bold font-display">{t('backgroundText')}</p>
                </div>
                <div className="2xl:px-96 xl:px-48 lg:px-24 py-16 h-[50vh] grid grid-rows-1 grid-cols-2 gap-x-10">
                    <div className="flex flex-col justify-center z-10">
                        <h1 className="mb-5 font-bold lg:text-5xl xl:text-6xl text-accent-brown">
                            <Trans t={t} i18nKey="title" components={{1: <br/>}}/>
                        </h1>
                        <p className="text-sm">
                            <Trans i18nKey="description" components={{1: <br/>}}/>
                        </p>
                    </div>

                    <div className="flex justify-center items-center z-10">
                        <Image src="/assets/desktop-decoration.webp" role="presentation" alt=""
                               className="rounded-3xl w-64 xl:w-72 object-cover h-80 xl:h-96"/>
                    </div>
                </div>

                <div className="2xl:px-96 xl:px-48 lg:px-24 py-8 flex flex-col justify-center h-[50vh] bg-accent-brown">
                    <h2 className="text-center font-bold text-3xl xl:text-4xl text-white mb-8">
                        {t('startOrdering')}
                    </h2>
                    <div className="flex justify-center items-center">
                        <div className="w-48 h-48 flex justify-center items-center bg-white rounded-3xl mr-8">
                            <ComponentPickupButton/>
                        </div>

                        <div className="w-48 h-48 flex justify-center items-center bg-white rounded-3xl mr-8">
                            <ComponentHistoryButton/>
                        </div>

                        <div className="w-48 h-48 flex justify-center items-center bg-white rounded-3xl">
                            <ComponentAccountButton/>
                        </div>

                        <div className="ml-8 h-48 flex justify-center items-center bg-white rounded-3xl">
                            <ComponentHomeStatus/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
