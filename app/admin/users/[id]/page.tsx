'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface User {
  userId: number
  email: string
  firstName: string
  lastName: string
  phone: string | null
  active: boolean
  suspended: boolean
  suspensionReason: string | null
  suspensionEndDate: Date | null
  createdAt: Date
  customerAppointments: any[]
  customerRatings: any[]
}

interface Stats {
  totalAppointments: number
  pending: number
  confirmed: number
  completed: number
  cancelled: number
  denied: number
  noShow: number
  ratingsGiven: number
}

export default function UserDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [showSuspendModal, setShowSuspendModal] = useState(false)
  const [suspendReason, setSuspendReason] = useState('')
  const [suspendDuration, setSuspendDuration] = useState('7')

  useEffect(() => {
    fetchUserDetails()
  }, [params.id])

  const fetchUserDetails = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/users/${params.id}`)
      const data = await res.json()
      setUser(data.user)
      setStats(data.stats)
    } catch (error) {
      console.error('Failed to fetch user details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (action: string, reason?: string, duration?: string) => {
    try {
      setActionLoading(true)
      const res = await fetch(`/api/admin/users/${params.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reason, duration }),
      })

      if (res.ok) {
        await fetchUserDetails()
        setShowSuspendModal(false)
        setSuspendReason('')
        setSuspendDuration('7')
      }
    } catch (error) {
      console.error('Action failed:', error)
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">Loading...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">User not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            {user.firstName} {user.lastName}
          </h1>
          <Link
            href="/admin/users"
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Back to Users
          </Link>
        </div>

        {/* User Info Card */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">User Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">User ID</p>
              <p className="font-semibold">{user.userId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-semibold">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-semibold">{user.phone || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-semibold">
                {user.suspended ? (
                  <span className="text-red-600">Suspended</span>
                ) : !user.active ? (
                  <span className="text-gray-600">Inactive</span>
                ) : (
                  <span className="text-green-600">Active</span>
                )}
              </p>
            </div>
            {user.suspended && (
              <>
                <div>
                  <p className="text-sm text-gray-500">Suspension Reason</p>
                  <p className="font-semibold">{user.suspensionReason}</p>
                </div>
                {user.suspensionEndDate && (
                  <div>
                    <p className="text-sm text-gray-500">Suspension Ends</p>
                    <p className="font-semibold">
                      {new Date(user.suspensionEndDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </>
            )}
            <div>
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="font-semibold">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Statistics</h2>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded">
                <p className="text-3xl font-bold text-blue-600">{stats.totalAppointments}</p>
                <p className="text-sm text-gray-600">Total Appointments</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded">
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded">
                <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded">
                <p className="text-3xl font-bold text-purple-600">{stats.ratingsGiven}</p>
                <p className="text-sm text-gray-600">Ratings Given</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Actions</h2>
          <div className="flex gap-4">
            {user.suspended ? (
              <button
                onClick={() => handleAction('unsuspend')}
                disabled={actionLoading}
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
              >
                {actionLoading ? 'Processing...' : 'Unsuspend User'}
              </button>
            ) : (
              <button
                onClick={() => setShowSuspendModal(true)}
                disabled={actionLoading}
                className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
              >
                Suspend User
              </button>
            )}

            {user.active ? (
              <button
                onClick={() => handleAction('deactivate')}
                disabled={actionLoading}
                className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-400"
              >
                {actionLoading ? 'Processing...' : 'Deactivate Account'}
              </button>
            ) : (
              <button
                onClick={() => handleAction('activate')}
                disabled={actionLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                {actionLoading ? 'Processing...' : 'Activate Account'}
              </button>
            )}
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Appointments</h2>
          {user.customerAppointments.length === 0 ? (
            <p className="text-gray-500">No appointments yet</p>
          ) : (
            <div className="space-y-4">
              {user.customerAppointments.slice(0, 10).map((apt: any) => (
                <div key={apt.appointmentId} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">
                        {apt.sharpener.firstName} {apt.sharpener.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{apt.location.locationName}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(apt.appointmentDate).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded ${
                          apt.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-800'
                            : apt.status === 'CONFIRMED'
                            ? 'bg-blue-100 text-blue-800'
                            : apt.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : apt.status === 'CANCELLED'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Suspend Modal */}
      {showSuspendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Suspend User</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Suspension
              </label>
              <textarea
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                className="w-full border rounded px-3 py-2"
                rows={3}
                placeholder="Enter reason..."
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration
              </label>
              <select
                value={suspendDuration}
                onChange={(e) => setSuspendDuration(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="30">30 days</option>
                <option value="90">90 days</option>
                <option value="permanent">Permanent</option>
              </select>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => handleAction('suspend', suspendReason, suspendDuration)}
                disabled={actionLoading || !suspendReason}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
              >
                {actionLoading ? 'Processing...' : 'Suspend'}
              </button>
              <button
                onClick={() => setShowSuspendModal(false)}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
