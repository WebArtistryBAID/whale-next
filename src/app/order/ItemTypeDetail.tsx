import Decimal from 'decimal.js'
import {useTranslationClient} from '@/app/i18n/client'
import {useEffect, useState} from 'react'
import {getUploadServePath, HydratedItemType} from '@/app/lib/actions/data-actions'
import {moneyRound} from '@/app/lib/utils'

export default function ItemTypeDetail({
    item,
    pickItem
}: { item: HydratedItemType, pickItem: () => void }) {
    const {t} = useTranslationClient('order')
    const [uploadServePath, setUploadServePath] = useState('')

    useEffect(() => {
        (async () => {
            setUploadServePath(await getUploadServePath())
        })()
    }, [])

    return (
        <div
            className="cursor-pointer hover:bg-accent-yellow-bg transition-colors duration-100 flex items-center p-4 rounded-xl"
            onClick={item.soldOut
                ? () => {
                }
                : pickItem}>
            <div className="mr-5 flex-shrink">
                <img
                    src={`${uploadServePath}/${item.image}`}
                    alt={`Image of ${item.name}`}
                    className={`rounded-full w-24 aspect-square object-cover ${item.soldOut ? 'grayscale' : ''}`}/>
            </div>
            <div className="flex-grow">
                <div className="w-full mb-2">
                    <p className={`${item.soldOut ? 'text-gray-400' : ''} font-bold lg:text-lg font-display mb-1`}>{item.name}</p>
                    <p className="text-xs text-gray-400">{item.shortDescription}</p>
                </div>
                <div className="flex">
                    <p className={`${item.soldOut ? 'text-gray-400' : ''} flex-grow text-sm lg:text-base`}><span
                        className="text-[0]">{t('a11y.price')}</span> ¥{moneyRound(new Decimal(item.basePrice).mul(item.salePercent)).toString()} {
                        !new Decimal(item.salePercent).eq(1)
                            ? <span className="ml-1 line-through"><span
                                className="text-[0]">{t('a11y.previousPrice')}</span> {item.basePrice}</span>
                            : null}</p>
                    {item.soldOut
                        ? <button className="bg-gray-300 px-3 py-1 lg:text-sm rounded-full text-xs text-gray-800">
                            {t('item.soldOut')}
                        </button>
                        : <button className="bg-black px-3 py-1 font-bold hover:bg-gray-900 lg:text-sm rounded-full
                                        transition-colors duration-100 text-xs text-white">
                            {t('item.pick')}
                        </button>
                    }
                </div>
            </div>
        </div>
    )
}
