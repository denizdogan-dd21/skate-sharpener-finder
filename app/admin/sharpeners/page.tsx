'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Sharpener {
  userId: number
  email: string
  firstName: string
  lastName: string
  phone: string | null
  active: boolean
  suspended: boolean
  suspensionReason: string | null
  suspensionEndDate: Date | null
  averageRating: number | null
  totalRatings: number
  createdAt: Date
  _count: {
    sharpenerAppointments: number
    sharpenerRatings: number
    locations: number
  }
}

export default function AdminSharpenersPage() {
  const [sharpeners, setSharpeners] = useState<Sharpener[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchSharpeners = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/sharpeners?page=${page}&limit=20`)
      const data = await res.json()
      setSharpeners(data.sharpeners || [])
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      console.error('Failed to fetch sharpeners:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSharpeners()
  }, [page])

  const getStatusBadge = (sharpener: Sharpener) => {
    if (sharpener.suspended) {
      return <span className="px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-800">Suspended</span>
    }
    if (!sharpener.active) {
      return <span className="px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-800">Inactive</span>
    }
    return <span className="px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800">Active</span>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Sharpener Management</h1>
          <Link 
            href="/admin/dashboard"
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Back to Dashboard
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">Loading...</div>
          </div>
        ) : (
          <>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sharpener
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sharpeners.map((sharpener) => (
                    <tr key={sharpener.userId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {sharpener.firstName} {sharpener.lastName}
                        </div>
                        <div className="text-sm text-gray-500">ID: {sharpener.userId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{sharpener.email}</div>
                        <div className="text-sm text-gray-500">{sharpener.phone || 'No phone'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(sharpener)}
                        {sharpener.suspended && sharpener.suspensionReason && (
                          <div className="text-xs text-gray-500 mt-1">
                            {sharpener.suspensionReason}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {sharpener.averageRating ? (
                          <div>
                            <div className="font-semibold text-yellow-600">
                              ⭐ {sharpener.averageRating.toFixed(1)}
                            </div>
                            <div className="text-xs">
                              ({sharpener.totalRatings} ratings)
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">No ratings yet</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{sharpener._count.locations} locations</div>
                        <div>{sharpener._count.sharpenerAppointments} appointments</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/admin/sharpeners/${sharpener.userId}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700"
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-white rounded shadow">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
