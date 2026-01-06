import { Navigation } from '@/components/navigation';
import { RSVPSection } from '@/components/sections/rsvp-section';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <main>{children}</main>
      <RSVPSection/>
    </>
  );
}
