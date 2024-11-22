import {useQuery} from '@tanstack/react-query'
import {Category} from '@prisma/client'
import {getItemTypesByCategory} from '@/app/lib/actions/data-actions'
import Devastation from '@/app/lib/components/Devastation'
import Loading from '@/app/lib/components/Loading'
import ItemTypeDetail from '@/app/order/ItemTypeDetail'
import {HydratedItemType} from '@/app/lib/actions/types'

export default function CategoryDetail({
    category,
    pickItem
}: { category: Category, pickItem: (item: HydratedItemType) => void }) {
    const items = useQuery({
        queryKey: ['categoryItems', `category-${category.id}`],
        queryFn: async () => await getItemTypesByCategory(category.id)
    })

    return (
        <div>
            <p className="text-lg font-display mb-3">{category.name}</p>

            {items.isError ? <div className="h-96"><Devastation/></div> : null}
            {items.isPending ? <div className="h-96"><Loading/></div> : null}
            {items.data != null
                ? <div className="grid grid-cols-1 2xl:grid-cols-2">
                    {(items.data as HydratedItemType[]).map(item =>
                        <ItemTypeDetail pickItem={() => {
                            pickItem(item)
                        }} key={item.id} item={item}/>)}
                </div>
                : null}
        </div>
    )
}
