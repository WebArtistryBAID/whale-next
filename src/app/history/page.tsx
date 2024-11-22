import {getMyOrders} from '@/app/lib/actions/data-actions'
import PageHistory from '@/app/history/PageHistory'

export default async function PageHistoryWrapper() {
    const initialData = await getMyOrders(1)
    return <PageHistory initialData={initialData}/>
}
