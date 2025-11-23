import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-primary-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <Image 
              src="/hockey-skates.jpeg" 
              alt="Ice Hockey Skates" 
              width={120} 
              height={120}
              className="mr-4 rounded-lg object-cover"
            />
            <h1 className="text-5xl font-extrabold text-gray-900">
              Skate Sharpener Finder
            </h1>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Find Professional Skate Sharpeners
            <span className="text-primary-600"> Near You</span>
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Connect with trusted skate sharpening professionals. Browse profiles, 
            view availability, and book appointments with ease.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/search" className="btn-primary text-lg px-8 py-3">
              Search Sharpeners
            </Link>
            <Link href="/auth/register" className="btn-secondary text-lg px-8 py-3">
              Join as Sharpener
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Search & Discover</h3>
            <p className="text-gray-900">
              Find sharpeners by location, view ratings, and check availability in real-time.
            </p>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Book Appointments</h3>
            <p className="text-gray-900">
              Request appointments for specific time slots and get confirmation from sharpeners.
            </p>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Rate & Review</h3>
            <p className="text-gray-900">
              Share your experience and help build trust in the community.
            </p>
          </div>
        </div>
      </div>

      {/* For Sharpeners Section */}
      <div className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Are You a Sharpener?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join our platform to manage your schedule, reach more customers, 
              and grow your business.
            </p>
            <Link href="/auth/register" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition duration-200 inline-block">
              Get Started Today
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl mb-3">📍</div>
              <h3 className="font-bold mb-2">Multiple Locations</h3>
              <p className="text-primary-100">Manage all your business locations in one place</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">⚙️</div>
              <h3 className="font-bold mb-2">Equipment Management</h3>
              <p className="text-primary-100">List your machines and radius options</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">💼</div>
              <h3 className="font-bold mb-2">Build Your Reputation</h3>
              <p className="text-primary-100">Collect ratings and grow your customer base</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Ready to Get Your Skates Sharpened?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Start searching for professional sharpeners in your area
        </p>
        <Link href="/search" className="btn-primary text-lg px-8 py-3">
          Find Sharpeners Now
        </Link>
      </div>
    </div>
  )
}
