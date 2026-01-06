// app/admin/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Image as ImageIcon, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="space-x-4">
            <Button asChild variant="outline">
              <Link href="/">View Website</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/dashboard/rsvp">RSVPs</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/dashboard/photos">Photos</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Link key={card.title} href={card.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
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

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
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
  );
}