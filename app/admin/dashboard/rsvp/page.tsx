'use client';

import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { useSession } from '@/lib/auth/auth-client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Link from 'next/link';
import { ArrowLeft, Download } from 'lucide-react';

interface RSVP {
  id: string;
  name: string;
  email: string;
  attending: boolean;
  guestCount: number;
  message?: string;
  createdAt: string;
}

export default function AdminRSVPPage() {
  const { data: session, isPending } = useSession();
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !session) {
      redirect('/admin/login');
    }
  }, [session, isPending]);

  useEffect(() => {
    fetchRSVPs();
  }, []);

  const fetchRSVPs = async () => {
    try {
      const response = await fetch('/api/rsvp');
      const data = await response.json();
      if (data.success) {
        setRsvps(data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch RSVPs');
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Attending', 'Guest Count', 'Message', 'Date'];
    const rows = rsvps.map(rsvp => [
      rsvp.name,
      rsvp.email,
      rsvp.attending ? 'Yes' : 'No',
      rsvp.guestCount,
      rsvp.message || '',
      new Date(rsvp.createdAt).toLocaleDateString()
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rsvps.csv';
    a.click();
  };

  if (isPending || isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  const attendingCount = rsvps.filter(r => r.attending).length;
  const totalGuests = rsvps.reduce((sum, r) => sum + (r.attending ? r.guestCount : 0), 0);

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon">
              <Link href="/admin/dashboard">
                <ArrowLeft />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">RSVP Responses</h1>
              <p className="text-gray-600 mt-1">
                {attendingCount} attending • {totalGuests} total guests
              </p>
            </div>
          </div>
          <Button onClick={exportToCSV} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Guests</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rsvps.map((rsvp) => (
                <TableRow key={rsvp.id}>
                  <TableCell className="font-medium">{rsvp.name}</TableCell>
                  <TableCell>{rsvp.email}</TableCell>
                  <TableCell>
                    <Badge variant={rsvp.attending ? 'default' : 'secondary'}>
                      {rsvp.attending ? 'Attending' : 'Not Attending'}
                    </Badge>
                  </TableCell>
                  <TableCell>{rsvp.attending ? rsvp.guestCount : '-'}</TableCell>
                  <TableCell className="max-w-xs">
                    <p className="truncate">{rsvp.message || '-'}</p>
                  </TableCell>
                  <TableCell>
                    {new Date(rsvp.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {rsvps.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No RSVPs yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
