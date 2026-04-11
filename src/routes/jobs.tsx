import { jobsApi } from '#/apis/jobsApi'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'

export const Route = createFileRoute('/jobs')({
    component: JobsPage,
})

function JobsPage() {
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize] = useState(10)
    const [selectedJobId, setSelectedJobId] = useState<number | null>(null)

    const {
        data: jobsData,
        isLoading: isJobsLoading,
        isError: isJobsError,
    } = useQuery({
        queryKey: ['admin-jobs-list', currentPage, pageSize],
        queryFn: () => jobsApi.getAdminJobs({ current: currentPage, pageSize }),
        staleTime: 60_000,
    })

    const jobs = jobsData?.items ?? []
    const meta = jobsData?.meta

    const visibleTotal = useMemo(() => meta?.total ?? jobs.length, [meta, jobs.length])
    const totalPages = useMemo(() => meta?.pages ?? 1, [meta])
    const paginationItems = useMemo<(number | string)[]>(() => {
        const safeTotalPages = Math.max(totalPages, 1)

        if (safeTotalPages <= 7) {
            return Array.from({ length: safeTotalPages }, (_, index) => index + 1)
        }

        const items: Array<number | string> = [1]
        const start = Math.max(2, currentPage - 1)
        const end = Math.min(safeTotalPages - 1, currentPage + 1)

        if (start > 2) {
            items.push('...')
        }

        for (let page = start; page <= end; page += 1) {
            items.push(page)
        }

        if (end < safeTotalPages - 1) {
            items.push('...')
        }

        items.push(safeTotalPages)
        return items
    }, [currentPage, totalPages])

    const {
        data: selectedJob,
        isLoading: isDetailLoading,
        isError: isDetailError,
    } = useQuery({
        queryKey: ['admin-job-detail', selectedJobId],
        queryFn: () => jobsApi.getJobDetail(selectedJobId as number),
        enabled: selectedJobId !== null,
        staleTime: 60_000,
    })

    const formatMoney = (value?: number) => {
        if (typeof value !== 'number') {
            return 'N/A'
        }
        return value.toLocaleString('vi-VN') + ' đ'
    }

    const formatDate = (value?: string) => {
        if (!value) {
            return 'N/A'
        }

        const date = new Date(value)
        if (Number.isNaN(date.getTime())) {
            return 'N/A'
        }

        return date.toLocaleString('vi-VN')
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý công việc</h1>
                <span className="text-sm text-gray-500">
                    Tổng công : {visibleTotal.toLocaleString('vi-VN')}
                </span>
            </div>

            <div className="island-shell rounded-2xl overflow-hidden bg-white border border-gray-100">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase text-gray-400">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Tiêu đề</th>
                            <th className="px-6 py-4">Địa điểm</th>
                            <th className="px-6 py-4">Giá</th>
                            <th className="px-6 py-4">Trạng thái</th>
                            <th className="px-6 py-4 text-right">Ngày tạo</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {isJobsLoading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-6 text-center text-sm text-gray-500">
                                    Đang tải danh sách công việc...
                                </td>
                            </tr>
                        ) : isJobsError ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-6 text-center text-sm text-red-600">
                                    Không tải được danh sách công việc.
                                </td>
                            </tr>
                        ) : jobs.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-6 text-center text-sm text-gray-500">
                                    Chưa có công việc nào.
                                </td>
                            </tr>
                        ) : (
                            jobs.map((job) => (
                                <tr
                                    key={job.id}
                                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                                    onClick={() => setSelectedJobId(job.id)}
                                >
                                    <td className="px-6 py-4 font-medium text-gray-700">#{job.id}</td>
                                    <td className="px-6 py-4 text-gray-700">{job.title}</td>
                                    <td className="px-6 py-4 text-gray-600">{job.address || 'N/A'}</td>
                                    <td className="px-6 py-4 text-gray-600">{formatMoney(job.price)}</td>
                                    <td className="px-6 py-4 text-gray-600">{job.status || 'N/A'}</td>
                                    <td className="px-6 py-4 text-right text-gray-600">
                                        {formatDate(job.createdAt)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage <= 1 || isJobsLoading}
                        className="px-4 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-50"
                    >
                        Trang trước
                    </button>

                    <div className="flex items-center gap-2 flex-wrap justify-center">
                        {paginationItems.map((item, index) =>
                            typeof item === 'number' ? (
                                <button
                                    key={item}
                                    onClick={() => setCurrentPage(item)}
                                    disabled={isJobsLoading}
                                    className={`min-w-9 px-3 py-2 rounded-lg border text-sm transition-colors ${item === currentPage
                                            ? 'border-orange-500 bg-orange-500 text-white'
                                            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                                        } disabled:opacity-50`}
                                >
                                    {item}
                                </button>
                            ) : (
                                <span key={`ellipsis-${index}`} className="px-1 text-sm text-gray-400">
                                    {item}
                                </span>
                            ),
                        )}
                    </div>

                    <button
                        onClick={() => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))}
                        disabled={isJobsLoading || currentPage >= totalPages}
                        className="px-4 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-50"
                    >
                        Trang sau
                    </button>
                </div>
            </div>

            <div className="island-shell rounded-2xl bg-white border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Chi tiết công việc</h2>
                {!selectedJobId ? (
                    <p className="text-sm text-gray-500">Chọn một công việc để xem chi tiết.</p>
                ) : isDetailLoading ? (
                    <p className="text-sm text-gray-500">Đang tải chi tiết...</p>
                ) : isDetailError ? (
                    <p className="text-sm text-red-600">Không tải được chi tiết công việc.</p>
                ) : (
                    <div className="space-y-2 text-sm text-gray-700">
                        <p>
                            <span className="font-semibold">ID:</span> #{selectedJob?.id}
                        </p>
                        <p>
                            <span className="font-semibold">Tiêu đề:</span> {selectedJob?.title}
                        </p>
                        <p>
                            <span className="font-semibold">Mô tả:</span> {selectedJob?.description || 'N/A'}
                        </p>
                        <p>
                            <span className="font-semibold">Địa điểm:</span> {selectedJob?.address || 'N/A'}
                        </p>
                        <p>
                            <span className="font-semibold">Giá:</span> {formatMoney(selectedJob?.price)}
                        </p>
                        <p>
                            <span className="font-semibold">Trạng thái:</span> {selectedJob?.status || 'N/A'}
                        </p>
                        <p>
                            <span className="font-semibold">Ngày tạo:</span> {formatDate(selectedJob?.createdAt)}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
