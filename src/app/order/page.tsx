'use client'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons'
import {useTranslationClient} from '@/app/i18n/client'
import {useEffect, useState} from 'react'
import {useShoppingCart} from '@/app/lib/provider/shopping-cart'
import {useRouter} from 'nextjs-toploader/app'
import {useQuery} from '@tanstack/react-query'
import {
    getAds,
    getCategories,
    getMeCanOrder,
    getMeCrossBoundary,
    getSettings,
    getTodayCupsAmount,
    HydratedItemType
} from '@/app/lib/actions/data-actions'
import {requireLoginClient} from '@/app/login/login-client'
import {useCookies} from 'react-cookie'
import Devastation from '@/app/lib/components/Devastation'
import Loading from '@/app/lib/components/Loading'
import Link from 'next/link'
import FullScreenMessage from '@/app/lib/components/FullScreenMessage'
import ItemSelectionDetail from '@/app/order/ItemSelectionDetail'
import Categories from '@/app/order/Categories'
import ShoppingCartDetail from '@/app/order/ShoppingCart'
import ShoppingCart from '@/app/order/ShoppingCart'
import CategoryDetail from '@/app/order/CategoryDetail'
import Ads from '@/app/order/Ad'
import OrderConfirmModal from '@/app/order/OrderConfirmModal'
import TopBar from '@/app/lib/components/TopBar'

export default function PageOrder() {
    const {t} = useTranslationClient('order')

    const [confirmModalOpen, setConfirmModalOpen] = useState(false)
    const [pickItem, setPickItem] = useState<HydratedItemType | null>(null)
    const shoppingCart = useShoppingCart()
    const router = useRouter()
    const [cookies] = useCookies()

    const categories = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories
    })

    const getShopOpen = useQuery({
        queryKey: ['get-shop-open'],
        queryFn: async () => await getSettings('shop-open')
    })

    const ads = useQuery({
        queryKey: ['ads'],
        queryFn: async () => await getAds()
    })

    const me = useQuery({
        queryKey: ['user-info-from-token'],
        queryFn: async () => await getMeCrossBoundary()
    })

    const meCanOrder = useQuery({
        queryKey: ['me-can-order'],
        queryFn: async () => await getMeCanOrder()
    })

    const quota = useQuery({
        queryKey: ['order-quota'],
        queryFn: async () => await getTodayCupsAmount()
    })

    const singleQuota = useQuery({
        queryKey: ['order-single-quota'],
        queryFn: async () => await getSettings('order-quota')
    })

    const totalQuota = useQuery({
        queryKey: ['order-total-quota'],
        queryFn: async () => await getSettings('total-quota')
    })

    useEffect(() => {
        (async () => {
            await requireLoginClient(cookies)
        })()
    }, [])

    if (categories.isError || getShopOpen.isError || me.isError || ads.isError || meCanOrder.isError || quota.isError || totalQuota.isError || singleQuota.isError) {
        return <Devastation screen={true}/>
    }

    if (categories.isPending || getShopOpen.isPending || me.isPending || ads.isPending || meCanOrder.isPending || quota.isPending ||
        totalQuota.isPending || singleQuota.isPending) {
        return <Loading screen={true}/>
    }

    if (me.data.blocked) {
        return <></>
    }

    if (meCanOrder.data != null && shoppingCart.getOnSiteOrderMode() === false) {
        return <div className="flex justify-center items-center w-screen lg:h-screen bg-gray-50 bg-cover bg-center"
                    style={{backgroundImage: `url(/assets/login-bg.webp)`}}>
            <div className="p-8 w-full h-full lg:w-2/3 lg:h-auto bg-white rounded-3xl">
                <div className="flex items-center mb-16">
                    <button onClick={() => {
                        router.push('/')
                    }} className="rounded-full p-1 hover:bg-gray-200 transition-colors duration-100 w-8 h-8 mr-3"
                            aria-label={t('a11y.back')}>
                        <FontAwesomeIcon icon={faArrowLeft} className="text-gray-800 text-lg"/>
                    </button>
                    <p className="font-display">{t('name')}</p>
                </div>

                <div id="main" className="h-full">
                    <h1 className="font-display text-3xl font-bold mb-5">{t('activeOrder.title')}</h1>
                    <div className="flex flex-col lg:flex-row w-full mb-5">
                        <div className="lg:w-1/2 lg:mr-3">
                            <p className="mb-1">{t('activeOrder.description')}</p>
                            <p className="mb-3">{t('activeOrder.orderInfo')}</p>
                            <Link href={`/check/${meCanOrder.data.id!}`}
                                  className="block hover:bg-accent-latte transition-colors duration-100 w-full bg-accent-yellow-bg rounded-3xl p-5 mb-3">
                                <p className="font-display text-xl font-bold">{meCanOrder.data.number}</p>
                                <p className="text-sm">{meCanOrder.data.createdAt.toLocaleDateString()}</p>
                                <p className="text-lg font-display">¥{meCanOrder.data.totalPrice.toString()}</p>
                            </Link>
                            <p className="mb-1">{t('activeOrder.qr')}</p>
                            <p className="text-sm text-gray-500 mb-1">{t('activeOrder.alreadyPaid')}</p>
                        </div>
                        <div className="lg:w-1/2 lg:ml-3">
                            <p className="mb-3 text-lg text-red-500">{t('activeOrder.qrInfo')}</p>
                            <div className="flex justify-center items-center">
                                <img src="/assets/pay-qr.jpg" alt="QR code" className="w-full lg:w-72 rounded-3xl"/>
                            </div>
                        </div>
                    </div>

                    <div className="w-full flex justify-center items-center">
                        <button
                            className="w-full max-w-96 rounded-full bg-blue-500 hover:bg-blue-600 hover:shadow-lg
                     transition-colors duration-100 p-2 text-white mb-8"
                            onClick={() => {
                                router.push('/')
                            }}>
                            {t('back')}
                        </button>
                    </div>
                </div>
            </div>
        </div>

    }

    if (getShopOpen.data === '0' || typeof getShopOpen.data === 'object') {
        return <FullScreenMessage title={t('notOpenTitle')} description={t('notOpenDescription')}/>
    }

    const totalQuotaInt = parseInt(totalQuota.data ?? '999')
    if (quota.data >= totalQuotaInt) {
        return <FullScreenMessage title={t('quotaTitle')} description={t('quotaDescription', {
            count: quota.data,
            quota: totalQuotaInt
        })}/>
    }

    const singleQuotaInt = parseInt(singleQuota.data ?? '999')

    const resultedCategories = categories.data

    return (<div>
            <OrderConfirmModal open={confirmModalOpen} close={() => {
                setConfirmModalOpen(false)
            }}/>

            <div className="lg:hidden flex flex-col h-screen">
                <div className="flex-shrink">
                    <TopBar/>
                </div>

                <div className="flex flex-grow min-h-0 relative bg-accent-latte">
                    <div
                        className={`absolute z-[200] top-0 left-0 w-full h-full transition-opacity duration-100 ${pickItem == null ? 'opacity-0 pointer-events-none' : ''}`}>
                        <ItemSelectionDetail item={pickItem} close={() => {
                            setPickItem(null)
                        }}/>
                    </div>

                    <div className="h-full" style={{flexShrink: '0'}}>
                        <Categories categories={resultedCategories}/>
                    </div>
                    <div className="flex-grow h-full overflow-y-auto p-5" id="main">
                        <h1 className="text-2xl font-display font-bold mb-5">{t('title')}</h1>

                        <div className="h-40 mb-8">
                            <Ads ads={ads.data}/>
                        </div>

                        {resultedCategories.map(category =>
                            <div key={category.id} className="mb-8" id={`category-m-${category.id}`}>
                                <CategoryDetail category={category} pickItem={(item) => {
                                    setPickItem(item)
                                }}/>
                            </div>)}
                    </div>
                </div>

                <div className="flex-shrink w-full">
                    <ShoppingCartDetail singleQuota={singleQuotaInt} order={() => {
                        if (shoppingCart.getTotalItems() > 0) {
                            setConfirmModalOpen(true)
                        }
                    }}/>
                </div>
            </div>

            <div className="hidden lg:flex h-screen flex-col">
                <div className="flex-shrink">
                    <Categories categories={resultedCategories}/>
                </div>
                <div className="flex flex-grow min-h-0 relative bg-accent-latte">
                    <div
                        className={`absolute top-0 left-0 overflow-y-scroll w-[calc(50%_-_1px)] max-h-full transition-opacity duration-100 ${pickItem == null ? 'opacity-0 pointer-events-none' : ''}`}>
                        <ItemSelectionDetail item={pickItem} close={() => {
                            setPickItem(null)
                        }}/>
                    </div>

                    <div className="w-1/2 border-r border-gray-300 border-solid h-full overflow-y-auto p-16" id="main">
                        <h1 className="text-4xl mb-8 font-display font-bold">{t('title')}</h1>

                        {resultedCategories.map(category => <div key={category.id}
                                                                 className="mb-8"
                                                                 id={`category-d-${category.id}`}>
                            <CategoryDetail category={category} pickItem={(item) => {
                                setPickItem(item)
                            }}/>
                        </div>)}
                    </div>
                    <div className="w-1/2 h-full p-8 xl:p-12 2xl:px-24 2xl:py-16">
                        <div className="flex flex-col h-full">
                            <div className="h-64 lg:h-2/5 mb-5">
                                <Ads ads={ads.data}/>
                            </div>
                            <div className="lg:h-3/5">
                                <ShoppingCart singleQuota={singleQuotaInt} order={() => {
                                    if (shoppingCart.getTotalItems() > 0) {
                                        setConfirmModalOpen(true)
                                    }
                                }}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

