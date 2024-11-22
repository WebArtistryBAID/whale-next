import {HydratedOrderedItem} from '@/app/lib/actions/types'
import {clientCalculate, moneyRound} from '@/app/lib/utils'

export default function ManagedItem({
    item
}: { item: HydratedOrderedItem }) {
    return (
        <div className="flex items-center p-4 rounded-xl">
            <div className="w-full mb-1">
                <p className="font-bold text-2xl font-display mb-1">{item.itemType.name}</p>
                <p className="text-xl text-black">{item.appliedOptions.map(option => option.name).join(' / ')}</p>
            </div>
            <div>
                <p className="text-xl">¥{moneyRound(clientCalculate(item)).toString()}</p>
                <div className="text-3xl">
                    <p>x{item.amount}</p>
                </div>
            </div>
        </div>
    )
}
