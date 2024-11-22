'use client'

import Devastation from '@/app/lib/components/Devastation'
import {useTranslationClient} from '@/app/i18n/client'
import {Fragment, useEffect, useState} from 'react'
import {HydratedOrder} from '@/app/lib/actions/types'
import {QueryClient, QueryClientProvider, useInfiniteQuery, useMutation, useQuery} from '@tanstack/react-query'
import {
    cancelOrder,
    getAllOrders,
    getSettings,
    getTodayOrders,
    setSettings,
    updateOrderStatus
} from '@/app/lib/actions/data-actions'
import {OrderStatus, OrderType} from '@prisma/client'
import Loading from '@/app/lib/components/Loading'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
    faCheck,
    faCircleCheck,
    faClose,
    faEdit,
    faHourglass,
    faMoneyBill,
    faMugSaucer,
    faPiggyBank,
    faSpinner,
    faTruck
} from '@fortawesome/free-solid-svg-icons'
import ManagedItem from '@/app/manage/ManagedItem'

const client = new QueryClient()

function PageManage() {
    const {t} = useTranslationClient('manage')
    const [selectedOrder, setSelectedOrder] = useState<HydratedOrder | null>(null)

    const [currentTime, setCurrentTime] = useState(0)
    const [cancelConfirm, setCancelConfirm] = useState(false)
    const [editingQuota, setEditingQuota] = useState(false)
    const [setQuota, setSetQuota] = useState('')
    const [tab, setTab] = useState('today')
    let legacyInterval: NodeJS.Timeout | null = null

    const now = new Date()
    const day = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`

    useEffect(() => {
        if (legacyInterval != null) {
            clearInterval(legacyInterval)
        }
        legacyInterval = setInterval(() => {
            if (selectedOrder === null) {
                return
            }
            setCurrentTime(new Date().getTime() - new Date(selectedOrder.createdAt).getTime())
        }, 300)

        return () => {
            clearInterval(legacyInterval!)
        }
    }, [selectedOrder])

    const todayOrders = useQuery({
        queryKey: ['today-orders'],
        queryFn: async () => await getTodayOrders(),
        refetchInterval: 7000
    })

    const allOrders = useInfiniteQuery({
        queryKey: ['all-orders'],
        queryFn: async ({pageParam}) => await getAllOrders(pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if ('detail' in lastPage || lastPage.page >= lastPage.pages) {
                return null
            }
            return lastPage.page + 1
        }
    })

    const getShopOpen = useQuery({
        queryKey: ['get-shop-open'],
        queryFn: async () => await getSettings('shop-open'),
        refetchInterval: 7000
    })

    const totalQuota = useQuery({
        queryKey: ['order-total-quota'],
        queryFn: async () => await getSettings('total-quota'),
        refetchInterval: 7000
    })

    const changeShopOpen = useMutation({
        mutationFn: async (open: string) => await setSettings('shop-open', open === '1' ? '0' : '1'),
        onSuccess: () => {
            void getShopOpen.refetch()
        }
    })

    const changeQuota = useMutation({
        mutationFn: async () => {
            if (isNaN(parseInt(setQuota)) || parseInt(setQuota) < 0) {
                return
            }
            await setSettings('total-quota', parseInt(setQuota).toString())
        },
        onSuccess: () => {
            void totalQuota.refetch()
        }
    })

    const changeStatus = useMutation({
        mutationFn: async ({newStatus, newPaid}: {
            newStatus: OrderStatus | null
            newPaid: boolean | null
        }) => await updateOrderStatus(selectedOrder!.id, newStatus, newPaid),
        onSuccess: (data) => {
            if (data == null) {
                return
            }
            setSelectedOrder(data)
            void todayOrders.refetch()
            void allOrders.refetch()
        }
    })

    const orderCancel = useMutation({
        mutationFn: async () => await cancelOrder(selectedOrder!.id),
        onSuccess: () => {
            setCancelConfirm(false)
            if (typeof orderCancel.data === 'object') {
                return
            }
            setSelectedOrder(null)
            void todayOrders.refetch()
            void allOrders.refetch()
        },
        onError: () => {
            setCancelConfirm(false)
        }
    })

    function cancel(): void {
        if (cancelConfirm) {
            orderCancel.mutate()
        } else {
            setCancelConfirm(true)
        }
    }

    function toggleShopOpen(): void {
        if (typeof getShopOpen.data === 'string') {
            changeShopOpen.mutate(getShopOpen.data)
        }
    }

    function msToTime(duration: number): string {
        const seconds = Math.floor((duration / 1000) % 60)
        const minutes = Math.floor((duration / (1000 * 60)) % 60)
        const hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

        const h = hours > 0 ? hours + 'h ' : ''
        const m = minutes > 0 ? minutes + 'm ' : ''
        const s = seconds > 0 ? seconds + 's' : ''

        return h + m + s
    }

    if (todayOrders.isError || (todayOrders.data != null && 'detail' in todayOrders.data)) {
        return <Devastation screen={true}/>
    }
    if (allOrders.isError || (allOrders.data != null && 'detail' in allOrders.data)) {
        return <Devastation screen={true}/>
    }

    return <div>
        <div className="h-screen w-screen p-12 flex flex-col">
            <p className="text-lg mb-5 flex-shrink">{t('title')}</p>
            <div className="flex flex-grow min-h-0">
                <div className="w-1/3 2xl:w-1/4 mr-5 rounded-3xl h-full flex flex-col min-h-0">
                    <div className="flex-shrink mb-3 flex w-full">
                        <button onClick={() => {
                            setTab('today')
                        }}
                                className={`rounded-3xl transition-all duration-200 w-1/3 p-2 mr-3 ${tab === 'today' ? 'bg-white shadow-md font-bold' : 'bg-gray-100'}`}>
                            {t('today')}
                        </button>
                        <button onClick={() => {
                            setTab('all')
                        }}
                                className={`rounded-3xl transition-all duration-200 w-1/3 p-2 mr-3 ${tab === 'all' ? 'bg-white shadow-md font-bold' : 'bg-gray-100'}`}>
                            {t('all')}
                        </button>
                        <button onClick={() => {
                            setTab('unpaid')
                        }}
                                className={`rounded-3xl transition-all duration-200 w-1/3 p-2 ${tab === 'unpaid' ? 'bg-white shadow-md font-bold' : 'bg-gray-100'}`}>
                            {t('unpaid')}
                        </button>
                    </div>
                    <div className="rounded-3xl bg-gray-100 p-3 mb-3 flex-grow overflow-y-auto">
                        {
                            tab === 'today'
                                ? <>
                                    {todayOrders.isPending ? <Loading/> : null}
                                    {todayOrders.isSuccess
                                        ? todayOrders.data.map(order => <button key={order.id} onClick={() => {
                                            setSelectedOrder(order)
                                        }}
                                                                                className={`p-3 rounded-2xl w-full text-left ${order.type === OrderType.pickUp ? 'bg-white hover:bg-gray-50' : 'bg-orange-50 hover:bg-orange-100'} mb-3 
                                        ${selectedOrder?.id === order.id ? 'shadow-lg text-accent-orange' : ''} transition-colors duration-100`}>
                                            <p className="font-bold text-xl">{order.number}</p>
                                        </button>)
                                        : null}
                                    {todayOrders.isSuccess && todayOrders.data.length < 1
                                        ? <div className="w-full h-full flex justify-center items-center flex-col">
                                            <FontAwesomeIcon icon={faMugSaucer} className="text-7xl text-gray-400 mb-3"/>
                                            <p className="text-lg mb-1">{t('noOrders')}</p>
                                        </div>
                                        : null}
                                </>
                                : null}

                        {
                            tab === 'all'
                                ? <>
                                    {allOrders.isPending ? <Loading/> : null}
                                    {allOrders.isSuccess
                                        ? allOrders.data.pages.map((page, i) => (
                                            <Fragment key={i}>
                                                {(page != null && !('detail' in page))
                                                    ? page.items.map(order => <button key={order.id} onClick={() => {
                                                        setSelectedOrder(order)
                                                    }}
                                                                                      className={`p-3 rounded-2xl w-full text-left ${order.type === OrderType.pickUp ? 'bg-white hover:bg-gray-50' : 'bg-orange-50 hover:bg-orange-100'} mb-3 
                                        ${selectedOrder?.id === order.id ? 'shadow-lg text-accent-orange' : ''} transition-colors duration-100`}>
                                                        <p className="font-bold text-xl">{order.number}</p>
                                                        <p className="text-gray-500 text-sm">{order.createdAt.toLocaleDateString()}</p>
                                                    </button>)
                                                    : null}
                                            </Fragment>
                                        ))
                                        : null}
                                    {allOrders.isFetchingNextPage
                                        ? <div className="flex justify-center items-center mb-3"><FontAwesomeIcon
                                            icon={faSpinner}
                                            aria-label={t('a11y.loading')}
                                            className="text-4xl text-gray-400"
                                            spin={true}/></div>
                                        : null}

                                    {allOrders.hasNextPage && !allOrders.isFetchingNextPage
                                        ? <div className="flex justify-center items-center">
                                            <button onClick={() => {
                                                void allOrders.fetchNextPage()
                                            }}
                                                    className="rounded-full py-2 px-5 bg-accent-yellow-bg hover:bg-accent-orange-bg transition-colors duration-100">{t('history.loadMore')}</button>
                                        </div>
                                        : null
                                    }
                                </>
                                : null}

                        {
                            tab === 'unpaid'
                                ? <>
                                    {allOrders.isPending ? <Loading/> : null}
                                    {allOrders.isSuccess
                                        ? allOrders.data.pages.map((page, i) => (
                                            <Fragment key={i}>
                                                {(page != null && !('detail' in page))
                                                    ? page.items.map(order => (!order.paid
                                                        ? <button key={order.id} onClick={() => {
                                                            setSelectedOrder(order)
                                                        }}
                                                                  className={`p-3 rounded-2xl w-full text-left ${order.type === OrderType.pickUp ? 'bg-white hover:bg-gray-50' : 'bg-orange-50 hover:bg-orange-100'} mb-3 
                                        ${selectedOrder?.id === order.id ? 'shadow-lg text-accent-orange' : ''} transition-colors duration-100`}>
                                                            <p className="font-bold text-xl">{order.number}</p>
                                                            <p className="text-gray-500 text-sm">{order.createdAt.toLocaleDateString()}</p>
                                                        </button>
                                                        : null))
                                                    : null}
                                            </Fragment>
                                        ))
                                        : null}
                                    {allOrders.isFetchingNextPage
                                        ? <div className="flex justify-center items-center mb-3"><FontAwesomeIcon
                                            icon={faSpinner}
                                            aria-label={t('a11y.loading')}
                                            className="text-4xl text-gray-400"
                                            spin={true}/></div>
                                        : null}

                                    {allOrders.hasNextPage && !allOrders.isFetchingNextPage
                                        ? <div className="flex justify-center items-center">
                                            <button onClick={() => {
                                                void allOrders.fetchNextPage()
                                            }}
                                                    className="rounded-full py-2 px-5 bg-accent-yellow-bg hover:bg-accent-orange-bg transition-colors duration-100">{t('history.loadMore')}</button>
                                        </div>
                                        : null
                                    }
                                </>
                                : null}
                    </div>
                    <div className="flex-shrink flex items-center mb-3">
                        {getShopOpen.isPending
                            ? <Loading/>
                            : <>
                                <p className="flex-grow mr-3">{getShopOpen.data === '1' ? t('shopOpen') : t('shopClosed')}</p>
                                <button onClick={toggleShopOpen}
                                        className="rounded-full bg-accent-yellow-bg hover:bg-accent-orange-bg transition-colors duration-100 px-4 py-2">{getShopOpen.data === '1' ? t('toggleShopClose') : t('toggleShopOpen')}</button>
                            </>}
                    </div>
                    <div className="flex-shrink flex items-center">
                        {totalQuota.isPending
                            ? <Loading/>
                            : <>
                                <p className="flex-grow mr-3">{t('totalQuota')}</p>
                                {!editingQuota ? <p className="mr-3">{totalQuota.data as string}</p> : null}
                                {editingQuota
                                    ? <input
                                        aria-label={t('totalQuota')} type="number"
                                        className="w-16 p-3 bg-gray-50 rounded-3xl appearance-none" value={setQuota}
                                        onChange={(e) => {
                                            setSetQuota(e.target.value)
                                        }}/>
                                    : null}
                                {!editingQuota
                                    ? <button onClick={() => {
                                        setEditingQuota(true)
                                        setSetQuota(totalQuota.data as string)
                                    }}
                                              className="rounded-full bg-accent-yellow-bg hover:bg-accent-orange-bg transition-colors duration-100 px-4 py-2">
                                        <FontAwesomeIcon icon={faEdit}/></button>
                                    : null}
                                {editingQuota
                                    ? <button onClick={() => {
                                        changeQuota.mutate()
                                        setEditingQuota(false)
                                    }}
                                              className="rounded-full bg-accent-yellow-bg hover:bg-accent-orange-bg mr-2 transition-colors duration-100 px-4 py-2">
                                        <FontAwesomeIcon icon={faCheck}/></button>
                                    : null}
                                {editingQuota
                                    ? <button onClick={() => {
                                        setEditingQuota(false)
                                    }}
                                              className="rounded-full bg-accent-yellow-bg hover:bg-accent-orange-bg transition-colors duration-100 px-4 py-2">
                                        <FontAwesomeIcon icon={faClose}/></button>
                                    : null}
                            </>}
                    </div>
                </div>
                <div className="w-2/3 2xl:w-3/4 ml-5">
                    {selectedOrder == null
                        ? <div className="w-full h-full flex justify-center items-center flex-col">
                            <FontAwesomeIcon icon={faMugSaucer} className="text-7xl text-gray-400 mb-3"/>
                            <p className="text-lg mb-1">{t('unselected')}</p>
                        </div>
                        : <div>
                            <h1 className="font-display font-bold text-5xl mb-3">{selectedOrder.number}</h1>

                            <div className="flex mb-8">
                                <div className="w-1/2 mr-8">
                                    <p className="text-lg mb-3">{t('updateStatus')}</p>
                                    <div className="w-full rounded-3xl flex">
                                        <button onClick={() => {
                                            changeStatus.mutate({newStatus: OrderStatus.waiting, newPaid: null})
                                        }}
                                                className={`px-4 py-8 mr-5 rounded-2xl flex w-1/2 h-full flex-col justify-center items-center ${selectedOrder.status === OrderStatus.waiting ? 'text-accent-orange bg-gray-50' : 'text-gray-500 bg-gray-100'}`}>
                                            <FontAwesomeIcon icon={faHourglass} className="text-6xl mb-2"/>
                                            <p className="text-lg">{t('status.waiting_' + selectedOrder.type)}</p>
                                        </button>
                                        <button onClick={() => {
                                            changeStatus.mutate({newStatus: OrderStatus.done, newPaid: null})
                                        }}
                                                className={`px-4 py-8 rounded-2xl flex w-1/2 h-full flex-col justify-center items-center ${selectedOrder.status === OrderStatus.done ? 'text-green-400 bg-gray-50' : 'text-gray-500 bg-gray-100'}`}>
                                            <FontAwesomeIcon
                                                icon={selectedOrder.type === OrderType.delivery ? faTruck : faCircleCheck}
                                                className="text-6xl mb-2"/>
                                            <p className="text-lg">{t('status.done_' + selectedOrder.type)}</p>
                                        </button>
                                    </div>
                                </div>
                                <div className="w-1/2">
                                    <p className="text-lg mb-3">{t('updatePaid')}</p>
                                    <div className="w-full rounded-3xl flex">
                                        <button onClick={() => {
                                            changeStatus.mutate({newStatus: null, newPaid: false})
                                        }}
                                                className={`px-4 py-8 mr-5 rounded-2xl flex w-1/2 h-full flex-col justify-center items-center ${!selectedOrder.paid ? 'text-yellow-400 bg-gray-50' : 'text-gray-500 bg-gray-100'}`}>
                                            <FontAwesomeIcon icon={faPiggyBank} className="text-6xl mb-2"/>
                                            <p className="text-lg">{t('notPaid')}</p>
                                        </button>
                                        <button onClick={() => {
                                            changeStatus.mutate({newStatus: null, newPaid: true})
                                        }}
                                                className={`px-4 py-8 rounded-2xl flex w-1/2 h-full flex-col justify-center items-center ${selectedOrder.paid ? 'text-yellow-400 bg-gray-50' : 'text-gray-500 bg-gray-100'}`}>
                                            <FontAwesomeIcon
                                                icon={faMoneyBill}
                                                className="text-6xl mb-2"/>
                                            <p className="text-lg">{t('paid')}</p>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex mb-5">
                                <div className="w-1/3">
                                    <p className="text-lg mb-3">{t('amountCharge')}</p>
                                    <p className="text-4xl font-bold">¥{selectedOrder.totalPrice}</p>
                                </div>
                                {selectedOrder.createdAt.getDate() === now.getDate()
                                    ? <div className="w-1/3">
                                        <p className="text-lg mb-3">{t('orderTime')}</p>
                                        <p className="text-4xl font-bold">{selectedOrder.status === OrderStatus.done ? t('done') : msToTime(currentTime)}</p>
                                    </div>
                                    : <div className="w-1/3">
                                        <p className="text-lg mb-3">{t('orderedOn')}</p>
                                        <p className="text-4xl font-bold">{selectedOrder.createdAt.toLocaleDateString()}</p>
                                    </div>}
                                <div className="w-1/3">
                                    <p className="text-lg mb-3">{t('orderBy')}</p>
                                    <p className="text-4xl font-bold">{selectedOrder.user?.name ?? selectedOrder.onSiteName}</p>
                                </div>
                            </div>
                            <div className="flex mb-3">
                                <div className="w-1/3">
                                    <p className="text-lg mb-3">{t('orderType')}</p>
                                    <p className="text-4xl font-bold">{t('type.' + selectedOrder.type)}</p>
                                </div>
                                <div className="w-1/3">
                                    <p className="text-lg mb-3">{t('deliveryRoom')}</p>
                                    <p className="text-4xl font-bold">{selectedOrder.type === OrderType.delivery ? selectedOrder.deliveryRoom : 'N/A'}</p>
                                </div>
                                {selectedOrder.status === OrderStatus.done || selectedOrder.paid
                                    ? null
                                    : <button
                                        className="w-1/3 rounded-3xl bg-accent-red hover:bg-red-500 p-8 font-bold text-3xl text-white"
                                        onClick={cancel}>
                                        {cancelConfirm ? t('cancelConfirm') : t('cancel')}
                                    </button>}
                            </div>

                            <p className="text-lg mb-3">{t('itemOrdered')}</p>
                            <div className="grid xl:grid-cols-1 2xl:grid-cols-2 gap-5">
                                {selectedOrder.items.map(item => <div key={item.id}
                                                                      className="rounded-3xl bg-accent-yellow-bg p-1">
                                    <ManagedItem item={item}/>
                                </div>)}
                            </div>
                        </div>}
                </div>
            </div>
        </div>
    </div>
}

export default function PageManageWrapper() {
    return <QueryClientProvider client={client}><PageManage/></QueryClientProvider>
}
