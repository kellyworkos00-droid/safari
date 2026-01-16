import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 via-green-700 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Safari Buddy</h1>
                <p className="text-xs text-gray-500">Explore Kenya</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href="/login"
                className="px-5 py-2.5 text-gray-700 font-semibold hover:text-green-600 transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-24 mb-20">
          <div className="inline-block mb-6 px-6 py-2 bg-green-50 border border-green-200 rounded-full">
            <span className="text-green-700 font-semibold text-sm">🇰🇪 Kenya's #1 Tourism Platform</span>
          </div>
          <h2 className="text-7xl font-extrabold text-gray-900 mb-8 leading-tight">
            Discover Kenya Like<br />
            <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">Never Before</span>
          </h2>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            Connect with verified tour guides and companies. Join group tours to split costs.
            Experience wildlife, beaches, mountains, and culture across Kenya.
          </p>
          <div className="flex justify-center gap-5 mb-12">
            <Link
              href="/tours"
              className="group px-10 py-5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl text-lg font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-2xl hover:shadow-green-500/50 transform hover:-translate-y-1"
            >
              <span className="flex items-center gap-2">
                Explore Tours
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            <Link
              href="/register?role=guide"
              className="px-10 py-5 bg-white text-gray-900 border-2 border-gray-300 rounded-2xl text-lg font-bold hover:border-green-600 hover:text-green-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Become a Guide
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-16">
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">5K+</div>
              <div className="text-gray-600 font-medium">Active Tourists</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">200+</div>
              <div className="text-gray-600 font-medium">Verified Guides</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-gray-600 font-medium">Destinations</div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          <div className="group relative bg-white p-10 rounded-3xl border-2 border-gray-100 hover:border-green-500 transition-all hover:shadow-2xl transform hover:-translate-y-2">
            <div className="absolute -top-6 left-10 w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
              <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="mt-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Group Tours</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Join existing tours to split transport and accommodation costs with fellow travelers
              </p>
            </div>
          </div>
          <div className="group relative bg-white p-10 rounded-3xl border-2 border-gray-100 hover:border-green-500 transition-all hover:shadow-2xl transform hover:-translate-y-2">
            <div className="absolute -top-6 left-10 w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
              <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="mt-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Verified Providers</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                All guides and companies are licensed and background-checked for your safety
              </p>
            </div>
          </div>
          <div className="group relative bg-white p-10 rounded-3xl border-2 border-gray-100 hover:border-green-500 transition-all hover:shadow-2xl transform hover:-translate-y-2">
            <div className="absolute -top-6 left-10 w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl">
              <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="mt-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">M-PESA Payments</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Secure payments with M-PESA integration and escrow protection
              </p>
            </div>
          </div>
        </div>

        {/* Popular Destinations */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h3 className="text-5xl font-extrabold text-gray-900 mb-4">
              Popular Destinations
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore Kenya's most breathtaking locations with experienced guides
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: 'Maasai Mara', desc: 'Wildlife Safari', color: 'from-amber-500 via-orange-500 to-red-500', tours: '45 Tours' },
              { name: 'Diani Beach', desc: 'Beach Paradise', color: 'from-blue-400 via-cyan-400 to-teal-400', tours: '32 Tours' },
              { name: 'Mt. Kenya', desc: 'Mountain Hiking', color: 'from-slate-600 via-gray-600 to-zinc-600', tours: '28 Tours' },
              { name: 'Naivasha', desc: 'Lake & Wildlife', color: 'from-emerald-400 via-green-400 to-teal-500', tours: '38 Tours' }
            ].map((dest) => (
              <Link key={dest.name} href="/tours" className="group cursor-pointer">
                <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-3">
                  <div className={`h-64 bg-gradient-to-br ${dest.color} relative`}>
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <h4 className="font-bold text-2xl text-white mb-1">{dest.name}</h4>
                      <p className="text-white/90 text-sm">{dest.desc}</p>
                    </div>
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                      <span className="text-white text-xs font-semibold">{dest.tours}</span>
                    </div>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-white to-gray-50">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium group-hover:text-green-600 transition">Explore Now</span>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-24 bg-gradient-to-br from-gray-50 to-white rounded-3xl p-12">
          <div className="text-center mb-16">
            <h3 className="text-5xl font-extrabold text-gray-900 mb-4">How It Works</h3>
            <p className="text-xl text-gray-600">Simple steps to your next adventure</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {[
              { step: '1', title: 'Browse & Select', desc: 'Explore verified tours and guides across Kenya', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
              { step: '2', title: 'Book & Pay', desc: 'Secure booking with M-PESA or card payment', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
              { step: '3', title: 'Experience', desc: 'Enjoy your adventure with peace of mind', icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {item.step}
                  </div>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h4>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="relative overflow-hidden text-center bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white rounded-3xl p-20 shadow-2xl mb-24">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAgMTZjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bS0xNiAwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wLTE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
          </div>
          <div className="relative z-10">
            <h3 className="text-5xl font-extrabold mb-6">Ready for Your Next Adventure?</h3>
            <p className="text-2xl mb-12 opacity-95 max-w-2xl mx-auto font-light">
              Join thousands of travelers exploring Kenya affordably and safely
            </p>
            <Link
              href="/register"
              className="inline-block px-12 py-5 bg-white text-green-600 rounded-2xl text-xl font-bold hover:bg-gray-50 transition-all shadow-2xl hover:shadow-white/50 transform hover:-translate-y-1"
            >
              Start Your Journey Today
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-lg mb-4">Safari Buddy</h4>
              <p className="text-gray-400 text-sm">Making Kenyan tourism accessible to everyone.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Providers</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/register?role=guide" className="hover:text-white transition">Become a Guide</Link></li>
                <li><Link href="/register?role=company" className="hover:text-white transition">Register Company</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2026 Safari Buddy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
