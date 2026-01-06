// app/admin/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Image as ImageIcon, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/admin/sidebar';

async function getDashboardStats() {
  const [totalRSVPs, attendingRSVPs, totalPhotos] = await Promise.all([
    prisma.rSVP.count(),
    prisma.rSVP.count({ where: { attending: true } }),
    prisma.galleryImage.count(),
  ]);

  return {
    totalRSVPs,
    attendingRSVPs,
    totalPhotos,
  };
}

export default async function AdminDashboardPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/admin/login');
  }

  const stats = await getDashboardStats();

  const cards = [
    {
      title: 'Total RSVPs',
      value: stats.totalRSVPs,
      icon: Users,
      color: 'text-blue-600',
      href: '/admin/dashboard/rsvp',
    },
    {
      title: 'Attending',
      value: stats.attendingRSVPs,
      icon: CheckCircle,
      color: 'text-green-600',
      href: '/admin/dashboard/rsvp',
    },
    {
      title: 'Total Photos',
      value: stats.totalPhotos,
      icon: ImageIcon,
      color: 'text-purple-600',
      href: '/admin/dashboard/photos',
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-center sm:text-left">Admin Dashboard</h1>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/">View Website</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {cards.map((card) => (
              <Link key={card.title} href={card.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {card.title}
                    </CardTitle>
                    <card.icon className={`w-5 h-5 ${card.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{card.value}</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-8 md:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild className="w-full justify-start">
                  <Link href="/admin/dashboard/photos">Manage Photos</Link>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link href="/admin/dashboard/rsvp">View RSVPs</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {stats.totalPhotos > 0
                    ? `${stats.totalPhotos} photo(s) in gallery`
                    : 'No photos uploaded yet'}
                </p>
                <p className="text-gray-600 mt-2">
                  {stats.totalRSVPs > 0
                    ? `${stats.totalRSVPs} guest(s) have responded to RSVP`
                    : 'No RSVPs yet'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}