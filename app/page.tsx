import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-primary-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-6">
            <Image 
              src="/hockey-skates.jpeg" 
              alt="Ice Hockey Skates" 
              width={80} 
              height={80}
              className="mb-4 sm:mb-0 sm:mr-4 rounded-lg object-cover"
            />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900">
              Skate Sharpener Finder
            </h1>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 px-4">
            Find Professional Skate Sharpeners
            <span className="text-primary-600"> Near You</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-10 max-w-3xl mx-auto px-4">
            Connect with trusted skate sharpening professionals. Browse profiles, 
            view availability, and book appointments with ease.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
            <Link href="/search" className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 w-full sm:w-auto">
              Search Sharpeners
            </Link>
            <Link href="/auth/register" className="btn-secondary text-base sm:text-lg px-6 sm:px-8 py-3 w-full sm:w-auto">
              Join as Sharpener
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">
          How It Works
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="card text-center">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🔍</div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900">Search & Discover</h3>
            <p className="text-sm sm:text-base text-gray-900">
              Find sharpeners by location, view ratings, and check availability in real-time.
            </p>
          </div>
          <div className="card text-center">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📅</div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900">Book Appointments</h3>
            <p className="text-sm sm:text-base text-gray-900">
              Request appointments for specific time slots and get confirmation from sharpeners.
            </p>
          </div>
          <div className="card text-center">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">⭐</div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900">Rate & Review</h3>
            <p className="text-sm sm:text-base text-gray-900">
              Share your experience and help build trust in the community.
            </p>
          </div>
        </div>
      </div>

      {/* For Sharpeners Section */}
      <div className="bg-primary-600 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Are You a Sharpener?</h2>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto">
              Join our platform to manage your schedule, reach more customers, 
              and grow your business.
            </p>
            <Link href="/auth/register" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-6 sm:px-8 rounded-lg transition duration-200 inline-block text-sm sm:text-base">
              Get Started Today
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mt-8 sm:mt-12">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
          Ready to Get Your Skates Sharpened?
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8">
          Start searching for professional sharpeners in your area
        </p>
        <Link href="/search" className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 inline-block">
          Find Sharpeners Now
        </Link>
      </div>
    </div>
  )
}
