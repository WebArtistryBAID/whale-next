import {useTranslation} from '@/app/i18n'
import {requireLogin} from '@/app/login/login'
import {getMe, getMeStatistics} from '@/app/lib/actions/data-actions'
import {Trans} from 'react-i18next/TransWithoutContext'
import TopBar from '@/app/lib/components/TopBar'
import Link from 'next/link'
import If from '@/app/lib/components/If'
import BottomNav from '@/app/lib/components/BottomNav'

export default async function PageAccount() {
    await requireLogin()
    const {t} = await useTranslation('account')
    const me = await getMe()
    const meStatistics = await getMeStatistics()

    return (<div>
            <div className="h-screen flex flex-col">
                <div className="flex-shrink">
                    <TopBar/>
                </div>
                <div id="main"
                     className="flex flex-grow min-h-0 flex-col h-full overflow-y-auto px-6 lg:px-24 xl:px-48 2xl:px-96 py-6 lg:pt-12 pb-36 lg:pb-12 bg-accent-latte">
                    <h1 className="flex-shrink text-2xl lg:text-4xl mb-8 font-display font-bold">{t('title')}</h1>

                    <div className="flex flex-grow flex-col">
                        <div className="flex items-center mb-5">
                            <div
                                className="rounded-full bg-accent-orange h-16 w-16 lg:h-24 lg:w-24 flex justify-center items-center mr-5">
                                <p className="text-white font-bold font-display text-2xl lg:text-4xl">{me.name[0].toUpperCase()}</p>
                            </div>
                            <div>
                                <p className="font-bold font-display text-2xl lg:text-3xl mb-1">{me.name}</p>
                                <p className="text-sm mb-3">{t('userGratification')}</p>
                            </div>
                        </div>

                        <div className="flex lg:flex-row flex-col">
                            <div className="w-full lg:w-1/2 lg:mr-5">
                                <p className="text-sm text-gray-500 mb-1">{t('basicInformation')}</p>
                                <hr className="w-full border-gray-200 mb-3"/>

                                <p className="text-sm">{t('eduId')}</p>
                                <p className="text-2xl font-bold font-display mb-3">{me.id}</p>

                                <p className="text-sm">{t('phone')}</p>
                                <p className="text-2xl font-bold font-display mb-5">{me.phone ?? t('unavailable')}</p>

                                <p className="text-sm mb-1">{t('points')}</p>
                                <div
                                    className="mb-8 bg-white rounded-3xl transition-shadow duration-100 shadow-xl hover:shadow-md p-5">
                                    <p className="text-2xl font-bold font-display text-accent-orange">{me.points.toString()}</p>
                                    <p className="text-sm">{t('pointsMessage')}</p>
                                </div>

                                <Link href="/account/logout"
                                      className="rounded-full w-48 py-2 px-5 bg-accent-yellow-bg hover:bg-accent-orange-bg transition-colors duration-100">{t('logOut')}</Link>

                                <p className="text-xs text-gray-500 mb-1 mt-5">{t('about')}</p>
                                <hr className="w-full border-gray-200 mb-3"/>

                                <p className="text-sm mb-3">
                                    <Trans t={t} i18nKey="credits" components={{
                                        1: <a className="underline"
                                              href="https://github.com/WebArtistryBAID/whale-next"/>
                                    }}/>
                                </p>
                            </div>

                            <div className="w-full lg:w-1/2 lg:ml-5">
                                <p className="text-sm text-gray-500 mb-1">{t('statistics')}</p>
                                <hr className="w-full border-gray-200 mb-3"/>

                                <p className="text-sm mb-1">{t('purchaseHistory')}</p>
                                <Link href="/history"
                                      className="text-center block rounded-full w-48 py-2 px-5 bg-accent-yellow-bg hover:bg-accent-orange-bg transition-colors duration-100 mb-3">{t('viewHistory')}</Link>

                                <div className="hidden lg:block">
                                    <If condition={me.permissions.includes('admin.manage') || me.permissions.includes('admin.cms')}>
                                        <p className="text-sm mb-1">{t('administration')}</p>
                                    </If>
                                    <If condition={me.permissions.includes('admin.manage')}>
                                        <Link href="/manage"
                                              className="text-center blockrounded-full w-48 py-2 px-5 bg-accent-yellow-bg hover:bg-accent-orange-bg transition-colors duration-100 mb-3 block">{t('orderManagement')}</Link>
                                    </If>
                                    <If condition={me.permissions.includes('admin.cms')}>
                                        <Link href="/admin"
                                              className="block rounded-full w-48 py-2 px-5 bg-accent-yellow-bg hover:bg-accent-orange-bg transition-colors duration-100 mb-3 text-center">{t('contentManagement')}</Link>
                                        <Link href="/stats"
                                              className="rounded-full w-48 py-2 px-5 bg-accent-yellow-bg hover:bg-accent-orange-bg transition-colors duration-100 mb-3">{t('statisticsManagement')}</Link>
                                    </If>
                                </div>
                                <div className="lg:hidden mb-3">
                                    <p className="text-sm">{t('administrationMobile')}</p>
                                </div>

                                <p className="text-sm">{t('totalSpent')}</p>
                                <p className="text-2xl font-bold font-display mb-3">¥{meStatistics.totalSpent}</p>

                                <p className="text-sm">{t('totalOrders')}</p>
                                <p className="text-2xl font-bold font-display mb-3">{meStatistics.totalOrders}</p>

                                <p className="text-sm">{t('totalCups')}</p>
                                <p className="text-2xl font-bold font-display mb-5">{meStatistics.totalCups}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:hidden">
                <BottomNav/>
            </div>
        </div>
    )
}
