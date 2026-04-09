import axiosClient from '#/utils/axiosClient'

interface AdminUsersQuery {
    current?: number
    pageSize?: number
}

type UserAdminStatus = 'ACTIVE' | 'LOCKED' | 'BANNED'

export interface AdminUserItem {
    id: number
    fullName?: string
    email?: string
    phone?: string
    role?: string
    status?: UserAdminStatus | string
    createdAt?: string
}

interface UsersMeta {
    page: number
    size: number
    pages: number
    total: number
}

export interface AdminUsersListResult {
    items: AdminUserItem[]
    meta: UsersMeta
}

const extractUserCount = (payload: unknown): number => {
    if (typeof payload === 'number') {
        return payload
    }

    if (typeof payload !== 'object' || payload === null) {
        return 0
    }

    const record = payload as Record<string, unknown>

    for (const key of ['count', 'totalUsers', 'total']) {
        if (typeof record[key] === 'number') {
            return record[key] as number
        }
    }

    const nestedData = record.data
    if (typeof nestedData === 'number') {
        return nestedData
    }

    if (typeof nestedData === 'object' && nestedData !== null) {
        const nestedRecord = nestedData as Record<string, unknown>
        for (const key of ['count', 'totalUsers', 'total']) {
            if (typeof nestedRecord[key] === 'number') {
                return nestedRecord[key] as number
            }
        }
    }

    return 0
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null

const pickNumber = (record: Record<string, unknown>, keys: string[]): number | undefined => {
    for (const key of keys) {
        if (typeof record[key] === 'number') {
            return record[key] as number
        }
    }

    return undefined
}

const pickString = (record: Record<string, unknown>, keys: string[]): string | undefined => {
    for (const key of keys) {
        if (typeof record[key] === 'string') {
            return record[key] as string
        }
    }

    return undefined
}

const unwrapPayload = (payload: unknown): Record<string, unknown> | null => {
    if (!isRecord(payload)) {
        return null
    }

    const data = payload.data
    if (isRecord(data)) {
        return data
    }

    return payload
}

const mapAdminUser = (value: unknown): AdminUserItem | null => {
    if (!isRecord(value)) {
        return null
    }

    const id = pickNumber(value, ['id'])
    if (typeof id !== 'number') {
        return null
    }

    return {
        id,
        fullName: pickString(value, ['fullName', 'name']),
        email: pickString(value, ['email']),
        phone: pickString(value, ['phone']),
        role: pickString(value, ['role']),
        status: pickString(value, ['status']),
        createdAt: pickString(value, ['createdAt']),
    }
}

const extractAdminUsersList = (payload: unknown): AdminUsersListResult => {
    const container = unwrapPayload(payload)
    if (!container) {
        return {
            items: [],
            meta: { page: 1, size: 10, pages: 0, total: 0 },
        }
    }

    const rawItems = Array.isArray(container.result)
        ? container.result
        : Array.isArray(container.data)
            ? container.data
            : []

    const items = rawItems
        .map((item) => mapAdminUser(item))
        .filter((item): item is AdminUserItem => item !== null)

    const meta = isRecord(container.meta) ? container.meta : null
    return {
        items,
        meta: {
            page: meta ? pickNumber(meta, ['page']) ?? 1 : 1,
            size: meta ? pickNumber(meta, ['size']) ?? items.length : items.length,
            pages: meta ? pickNumber(meta, ['pages']) ?? 0 : 0,
            total: meta ? pickNumber(meta, ['total']) ?? items.length : items.length,
        },
    }
}

export const usersApi = {
    getAdminUsers: ({ current = 1, pageSize = 10 }: AdminUsersQuery = {}) =>
        axiosClient
            .get('/api/users/admin/all', { params: { current, pageSize } })
            .then((res) => extractAdminUsersList(res)),

    updateUserStatus: (id: number, status: UserAdminStatus) =>
        axiosClient.patch(`/api/users/admin/${id}/status`, null, {
            params: { status },
        }),

    getCountUsers: () =>
        axiosClient.get('/api/users/count-users').then((res) => extractUserCount(res)),
}
