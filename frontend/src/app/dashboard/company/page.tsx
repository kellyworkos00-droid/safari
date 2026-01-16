'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';

interface Guide {
  id: number;
  name: string;
  email: string;
  tours_count: number;
  bookings_count: number;
}

export default function CompanyDashboard() {
  const router = useRouter();
  const [company, setCompany] = useState({ name: 'Safari Tours Ltd', email: 'info@safaritours.com' });
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch company data and guides from API
    setTimeout(() => {
      setGuides([]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-green-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Safari Buddy
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/company/guides/add" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition">
              Add Guide
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-red-600 hover:text-red-700 font-medium transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 mb-8 text-white">
          <h1 className="text-4xl font-extrabold mb-2">Welcome, {company.name}!</h1>
          <p className="text-purple-100 text-lg">Manage your guides and tours</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Guides', value: '0', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', color: 'from-blue-500 to-blue-600' },
            { label: 'Active Tours', value: '0', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'from-green-500 to-green-600' },
            { label: 'Total Bookings', value: '0', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', color: 'from-purple-500 to-purple-600' },
            { label: 'Monthly Revenue', value: '$0', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'from-orange-500 to-orange-600' }
          ].map((stat, idx) => (
            <div key={idx} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-lg`}>
              <div className="flex items-center justify-between mb-2">
                <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                </svg>
              </div>
              <div className="text-3xl font-extrabold mb-1">{stat.value}</div>
              <div className="text-sm opacity-90">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Guides Management */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Our Guides</h2>
                <Link href="/dashboard/company/guides/add" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition">
                  Add New Guide
                </Link>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse border border-gray-200 rounded-xl p-4">
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : guides.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-20 h-20 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No guides yet</h3>
                  <p className="text-gray-600 mb-6">Add your first guide to start managing tours!</p>
                  <Link href="/dashboard/company/guides/add" className="inline-block px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold transition">
                    Add Guide
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {guides.map(guide => (
                    <div key={guide.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                            {guide.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{guide.name}</h3>
                            <p className="text-gray-600 text-sm">{guide.email}</p>
                          </div>
                        </div>
                        <Link href={`/dashboard/company/guides/${guide.id}`} className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                          Manage →
                        </Link>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div>{guide.tours_count} tours</div>
                        <div>{guide.bookings_count} bookings</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Company Card */}
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  {company.name.charAt(0)}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{company.name}</h3>
                <p className="text-gray-600 text-sm">{company.email}</p>
                <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Verified Company
                </div>
              </div>
              <Link href="/profile" className="block w-full py-2 text-center border border-gray-300 rounded-lg hover:border-purple-600 hover:text-purple-600 font-medium transition">
                Edit Profile
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link href="/dashboard/company/guides/add" className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span className="font-medium text-gray-700">Add Guide</span>
                </Link>
                <Link href="/dashboard/company/tours" className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium text-gray-700">View All Tours</span>
                </Link>
                <Link href="/dashboard/company/bookings" className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="font-medium text-gray-700">All Bookings</span>
                </Link>
                <Link href="/dashboard/company/analytics" className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="font-medium text-gray-700">Analytics</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
