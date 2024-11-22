import {Category, OrderStatus, OrderType, Tag} from '@prisma/client'

export interface OrderCreate {
    type: OrderType
    deliveryRoom: string | undefined
    items: OrderedItemCreate[]
    onSiteOrder: boolean
    onSiteName: string | undefined
}

export interface HydratedItemType {
    id: number
    category: Category
    categoryId: number
    name: string
    image: string | null
    tags: Tag[]
    description: string
    shortDescription: string
    options: HydratedOptionType[]
    basePrice: string
    salePercent: string
    soldOut: boolean
}

export interface HydratedOptionType {
    id: number
    name: string
    items: SerializableOptionItem[]
}

export interface SerializableOptionItem {
    id: number
    name: string
    priceChange: string
    soldOut: boolean
    default: boolean
}

export interface SerializableUser {
    id: string
    name: string
    pinyin: string
    phone: string | null
    permissions: string[]
    createdAt: Date
    updatedAt: Date
    blocked: boolean
    points: string
}

export interface HydratedOrder {
    id: number
    type: OrderType
    status: OrderStatus
    user: SerializableUser | null
    items: HydratedOrderedItem[]
    userId: string | null
    deliveryRoom: string | null
    number: string
    onSiteName: string | null
    totalPrice: string
    paid: boolean
    createdAt: Date
    updatedAt: Date
}

export interface HydratedOrderedItem {
    id: number
    orderId: number
    itemType: HydratedItemType
    itemTypeId: number
    appliedOptions: SerializableOptionItem[]
    amount: number
}

export interface OrderedItemCreate {
    itemType: number
    appliedOptions: number[]
    amount: number
}

export interface OrderEstimate {
    time: number
    orders: number
}

export interface Paginated<T> {
    items: T[]
    page: number
    pages: number
}

export interface UserStatistics {
    totalOrders: number
    totalSpent: string
    totalCups: number
}
