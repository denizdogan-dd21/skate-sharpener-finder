'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Stats {
  totalCustomers: number
  totalSharpeners: number
  totalAppointments: number
  activeAppointments: number
  completedAppointments: number
  totalRatings: number
  averageRating: number
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    } else if (status === 'authenticated' && session?.user?.userType !== 'ADMIN') {
      router.push('/')
    } else if (status === 'authenticated') {
      fetchStats()
    }
  }, [status, session, router])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Failed to load dashboard</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {session?.user?.firstName}!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalCustomers}</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Sharpeners</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalSharpeners}</p>
              </div>
              <div className="text-4xl">⚙️</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalAppointments}</p>
              </div>
              <div className="text-4xl">📅</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Active Appointments</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeAppointments}</p>
              </div>
              <div className="text-4xl">🔄</div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Completed Appointments</p>
            <p className="text-2xl font-bold text-green-600">{stats.completedAppointments}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Total Ratings</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.totalRatings}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Average Rating</p>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.averageRating.toFixed(2)} ⭐
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin/users"
              className="btn-primary text-center"
            >
              View All Users
            </Link>
            <Link
              href="/admin/sharpeners"
              className="btn-primary text-center"
            >
              View All Sharpeners
            </Link>
            <Link
              href="/admin/appointments"
              className="btn-primary text-center"
            >
              View All Appointments
            </Link>
            <button
              onClick={fetchStats}
              className="btn-secondary"
            >
              Refresh Stats
            </button>
          </div>
        </div>

        {/* Admin Features */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            ✅ Available Admin Features
          </h3>
          <p className="text-green-800 mb-3">
            All core admin features are now available:
          </p>
          <ul className="list-disc list-inside text-green-800 space-y-1">
            <li>User management - View, suspend, unsuspend, activate, and deactivate accounts</li>
            <li>Sharpener management - Complete oversight with locations, machines, appointments, and ratings</li>
            <li>Appointment management - View all appointments with status filters</li>
            <li>No-show tracking - Sharpeners can mark appointments as no-show</li>
            <li>Account status filters - Filter by active, suspended, or inactive accounts</li>
            <li>Audit logging - All admin actions are logged in the database</li>
            <li>Two-factor authentication - Email-based OTP with device trust for 180 days</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
