import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons'
import {Category} from '@prisma/client'
import {ShoppingCart, useShoppingCart} from '@/app/lib/provider/shopping-cart'
import {useRouter} from 'nextjs-toploader/app'
import {useTranslationClient} from '@/app/i18n/client'

export default function Categories({
    categories
}:
{ categories: Category[] }) {
    const shoppingCart: ShoppingCart = useShoppingCart()
    const router = useRouter()
    const {t} = useTranslationClient('order')

    return (
        <div className="h-full">
            <div className="lg:hidden bg-accent-orange-bg border-r border-gray-100 border-solid h-full">
                {categories.map((category) =>
                    <button key={category.id}
                            className="p-4 block hover:bg-gray-200 duration-100 transition-colors w-full">
                        <p className="text-sm">{category.name}</p>
                    </button>)}
            </div>

            <div
                className="hidden lg:flex bg-accent-brown border-b border-gray-700 text-white border-solid w-full items-center">
                <div className="flex-shrink mr-4 p-4 flex items-center">
                    <button onClick={() => {
                        router.push('/')
                    }} className="rounded-full p-1 hover:bg-yellow-900 transition-colors duration-100 w-8 h-8 mr-2"
                            aria-label={t('a11y.close')}>
                        <FontAwesomeIcon icon={faArrowLeft} className="text-white text-lg"/>
                    </button>
                    <p className="font-bold font-display">{t('name')}</p>
                </div>
                <div className="flex-grow h-full">
                    {categories.map((category) =>
                        <button key={category.id}
                                className="p-5 hover:bg-yellow-900 duration-100 transition-colors h-full">
                            <p>{category.name}</p>
                        </button>)}
                </div>
                <div className="flex-shrink h-full">
                    {shoppingCart.getOnSiteOrderMode()
                        ? <button onClick={() => {
                            shoppingCart.setOnSiteOrderMode(false)
                        }} className="p-5 hover:bg-yellow-900 duration-100 transition-colors h-full">
                            <p>{t('exitOnSite')}</p>
                        </button>
                        : null}
                </div>
            </div>
        </div>
    )
}
