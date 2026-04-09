import axiosClient from '#/utils/axiosClient'

interface AdminJobsQuery {
    current?: number
    pageSize?: number
}

export interface JobItem {
    id: number
    title: string
    description?: string
    price?: number
    address?: string
    status?: string
    createdAt?: string
}

interface JobsMeta {
    page: number
    size: number
    pages: number
    total: number
}

export interface JobsListResult {
    items: JobItem[]
    meta: JobsMeta
}

const extractCompletedJobsCount = (payload: unknown): number => {
    if (typeof payload === 'number') {
        return payload
    }

    if (typeof payload !== 'object' || payload === null) {
        return 0
    }

    const record = payload as Record<string, unknown>

    for (const key of ['count', 'total', 'completedJobs']) {
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
        for (const key of ['count', 'total', 'completedJobs']) {
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

const mapJob = (value: unknown): JobItem | null => {
    if (!isRecord(value)) {
        return null
    }

    const id = pickNumber(value, ['id'])
    if (typeof id !== 'number') {
        return null
    }

    return {
        id,
        title: pickString(value, ['title']) ?? 'Khong co tieu de',
        description: pickString(value, ['description']),
        price: pickNumber(value, ['price']),
        address: pickString(value, ['address']),
        status: pickString(value, ['status', 'jobStatus']),
        createdAt: pickString(value, ['createdAt']),
    }
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

const extractJobsList = (payload: unknown): JobsListResult => {
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
        .map((item) => mapJob(item))
        .filter((item): item is JobItem => item !== null)

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

const extractJobDetail = (payload: unknown): JobItem => {
    const container = unwrapPayload(payload)
    const mapped = container ? mapJob(container) : null

    if (!mapped) {
        return {
            id: 0,
            title: 'Khong tai du lieu',
        }
    }

    return mapped
}

export const jobsApi = {
    getAdminJobs: ({ current = 1, pageSize = 10 }: AdminJobsQuery = {}) =>
        axiosClient
            .get('/api/jobs/admin/all', { params: { current, pageSize } })
            .then((res) => extractJobsList(res)),

    getJobDetail: (id: number) =>
        axiosClient.get(`/api/jobs/${id}`).then((res) => extractJobDetail(res)),

    getCompletedJobsCount: () =>
        axiosClient
            .get('/api/jobs/jobs-completed')
            .then((res) => extractCompletedJobsCount(res)),
}
