import {clientCalculate, moneyRound} from '@/app/lib/utils'
import {useEffect, useState} from 'react'
import {getUploadServePath} from '@/app/lib/actions/data-actions'
import {useTranslationClient} from '@/app/i18n/client'
import {LocalOrderedItem} from '@/app/lib/provider/shopping-cart'

export default function OrderedItemDetail({
    item,
    changeAmount
}: { item: LocalOrderedItem, changeAmount: ((amount: number) => void) | null }) {
    const {t} = useTranslationClient('order')
    const [uploadServePath, setUploadServePath] = useState('')
    useEffect(() => {
        (async () => {
            setUploadServePath(await getUploadServePath())
        })()
    }, [])

    return (
        <div className="flex items-center p-4 rounded-xl">
            <div className="mr-5 flex-shrink">
                <img
                    src={`${uploadServePath}/${item.itemType.image}`}
                    alt={`Picture of ${item.itemType.name}`}
                    className="rounded-full w-16 lg:w-24 aspect-square object-cover"/>
            </div>
            <div className="flex-grow">
                <div className="w-full mb-1">
                    <p className="font-bold lg:text-lg font-display mb-1">{item.itemType.name}</p>
                    <p className="text-xs text-gray-400">{item.appliedOptions.map(option => option.name).join(' / ')}</p>
                </div>
                <div className="flex">
                    <p className="flex-grow text-sm lg:text-base">¥{moneyRound(clientCalculate(item)).toString()}</p>
                    {changeAmount == null
                        ? <div className="flex-shrink">
                            <p>x{item.amount}</p>
                        </div>
                        : <div className="flex-shrink flex items-center">
                            <button className="bg-black p-1 aspect-square w-6 h-6 mr-2 font-bold hover:bg-gray-900 text-lg rounded-full
                                        transition-colors duration-100 text-white flex justify-center items-center"
                                    aria-label={t('a11y.remove')}
                                    onClick={() => {
                                        changeAmount(-1)
                                    }}>
                                -
                            </button>
                            <div
                                className="bg-white rounded-full w-6 h-6 flex justify-center items-center p-1 font-display">
                                {item.amount}
                            </div>
                            <button className="bg-black p-1 aspect-square w-6 h-6 ml-2 font-bold hover:bg-gray-900 text-lg rounded-full
                                        transition-colors duration-100 text-white flex justify-center items-center"
                                    aria-label={t('a11y.add')}
                                    onClick={() => {
                                        changeAmount(1)
                                    }}>
                                +
                            </button>
                        </div>}
                </div>
            </div>
        </div>
    )
}

OrderedItemDetail.defaultProps = {
    changeAmount: null
}
