'use client'

import {useTranslationClient} from '@/app/i18n/client'
import {QueryClient, QueryClientProvider, useInfiniteQuery} from '@tanstack/react-query'
import {getMyOrders, HydratedOrder, Paginated} from '@/app/lib/actions/data-actions'
import {useCookies} from 'react-cookie'
import {Fragment, useEffect} from 'react'
import {requireLoginClient} from '@/app/login/login-client'
import Devastation from '@/app/lib/components/Devastation'
import TopBar from '@/app/lib/components/TopBar'
import HistoricalOrder from '@/app/history/HistoricalOrder'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faMugSaucer, faSpinner} from '@fortawesome/free-solid-svg-icons'
import BottomNav from '@/app/lib/components/BottomNav'

const client = new QueryClient()

function PageHistoryData({initialData}: { initialData: Paginated<HydratedOrder> }) {
    const {t} = useTranslationClient('history')
    const [cookies] = useCookies()

    const query = useInfiniteQuery({
        queryKey: ['user-orders'],
        queryFn: async ({pageParam}) => await getMyOrders(pageParam),
        initialPageParam: 2,
        initialData: {
            pageParams: [initialData.page],
            pages: [initialData]
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.page >= lastPage.pages) {
                return null
            }
            return lastPage.page + 1
        }
    })

    useEffect(() => {
        (async () => {
            await requireLoginClient(cookies)
        })()
    }, [])

    if (query.isError) {
        return <Devastation screen={true}/>
    }

    let hasItems = false
    for (const page of query.data!.pages) {
        if (page.items.length > 0) {
            hasItems = true
            break
        }
    }

    return (
        <div>
            <div className="lg:hidden flex flex-col h-screen bg-accent-latte">
                <div className="flex-shrink">
                    <TopBar/>
                </div>

                <div id="main" className="flex flex-col flex-grow h-full min-h-0 overflow-y-auto relative px-6">
                    <h1 className="text-2xl font-display font-bold my-5">{t('title')}</h1>

                    {query.data.pages.map((page, i) => (
                        <Fragment key={i}>
                            {(page != null && !('detail' in page))
                                ? page.items.map((order, index) => (
                                    <HistoricalOrder order={order} key={index}/>
                                ))
                                : null}
                        </Fragment>
                    ))}

                    {!hasItems
                        ? <div className="w-full h-full flex flex-col justify-center items-center">
                            <FontAwesomeIcon icon={faMugSaucer} className="text-4xl text-gray-400 mb-3"/>
                            <p className="text-lg mb-1">{t('empty')}</p>
                        </div>
                        : null}
                </div>
                <BottomNav/>
            </div>

            <div className="hidden lg:flex h-screen flex-col bg-accent-latte">
                <div className="flex-shrink">
                    <TopBar/>
                </div>
                <div id="main"
                     className="flex flex-grow min-h-0 flex-col h-full overflow-y-auto px-12 xl:px-48 2xl:px-96 py-12">
                    <h1 className="text-4xl mb-8 font-display font-bold">{t('title')}</h1>

                    <div className="w-full mb-3">
                        <div className="grid grid-cols-2 xl:grid-cols-3 gap-x-3 gap-y-1">
                            {query.data.pages.map((page, i) => (
                                <Fragment key={i}>
                                    {(page != null && !('detail' in page))
                                        ? page.items.map((order, index) => (
                                            <HistoricalOrder order={order} key={index}/>
                                        ))
                                        : null}
                                </Fragment>
                            ))}
                        </div>

                        {!hasItems
                            ? <div className="w-full flex flex-col justify-center items-center">
                                <FontAwesomeIcon icon={faMugSaucer} className="text-4xl text-gray-400 mb-3"/>
                                <p className="text-lg mb-1">{t('empty')}</p>
                            </div>
                            : null}
                    </div>

                    {query.isFetchingNextPage
                        ? <div className="flex justify-center items-center mb-3"><FontAwesomeIcon icon={faSpinner}
                                                                                                  aria-label={t('a11y.loading')}
                                                                                                  className="text-4xl text-gray-400"
                                                                                                  spin={true}/></div>
                        : null}

                    {query.hasNextPage && !query.isFetchingNextPage
                        ? <div className="flex justify-center items-center">
                            <button onClick={() => {
                                void query.fetchNextPage()
                            }}
                                    className="rounded-full py-2 px-5 bg-accent-yellow-bg hover:bg-accent-orange-bg transition-colors duration-100">{t('loadMore')}</button>
                        </div>
                        : null
                    }
                </div>
            </div>
        </div>
    )
}

export default function PageHistory({initialData}: { initialData: Paginated<HydratedOrder> }) {
    return <QueryClientProvider client={client}><PageHistoryData initialData={initialData}/></QueryClientProvider>
}
