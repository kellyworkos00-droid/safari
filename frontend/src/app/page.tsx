import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🦁</span>
              <h1 className="text-2xl font-bold text-green-600">Safari Buddy</h1>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/login"
                className="px-4 py-2 text-gray-700 hover:text-green-600 transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Discover Kenya Like Never Before
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Connect with verified tour guides and companies. Join group tours to split costs.
            Explore wildlife, beaches, mountains, and cultural experiences across Kenya.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/tours"
              className="px-8 py-4 bg-green-600 text-white rounded-lg text-lg font-semibold hover:bg-green-700 transition"
            >
              Browse Tours
            </Link>
            <Link
              href="/register?role=guide"
              className="px-8 py-4 bg-white text-green-600 border-2 border-green-600 rounded-lg text-lg font-semibold hover:bg-green-50 transition"
            >
              Become a Guide
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl mb-4">🤝</div>
            <h3 className="text-xl font-semibold mb-2">Group Tours</h3>
            <p className="text-gray-600">
              Join existing tours to split transport and accommodation costs with other travelers
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl mb-4">✅</div>
            <h3 className="text-xl font-semibold mb-2">Verified Providers</h3>
            <p className="text-gray-600">
              All guides and companies are licensed and background-checked for your safety
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl mb-4">📱</div>
            <h3 className="text-xl font-semibold mb-2">M-PESA Payments</h3>
            <p className="text-gray-600">
              Secure payments with M-PESA integration and escrow protection
            </p>
          </div>
        </div>

        {/* Popular Destinations */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Popular Destinations
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            {['Maasai Mara', 'Diani Beach', 'Mt. Kenya', 'Naivasha'].map((dest) => (
              <div key={dest} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="h-48 bg-gradient-to-br from-green-400 to-blue-400"></div>
                <div className="p-4">
                  <h4 className="font-semibold text-lg">{dest}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-green-600 text-white rounded-2xl p-12">
          <h3 className="text-3xl font-bold mb-4">Ready for Your Next Adventure?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of travelers exploring Kenya affordably and safely
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-white text-green-600 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
          >
            Start Exploring
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2026 Safari Buddy. Making Kenyan tourism accessible to all.</p>
        </div>
      </footer>
    </div>
  );
}
