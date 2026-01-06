import { HeroSection } from '@/components/sections/hero-section';
import { StorySection } from '@/components/sections/story-section';
import { EventDetailsSection } from '@/components/sections/event-details-section';
import { GalleryPreviewSection } from '@/components/sections/gallery-preview-section';
import { RSVPSection } from '@/components/sections/rsvp-section';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StorySection />
      <EventDetailsSection />
      <GalleryPreviewSection />
      <RSVPSection />
    </>
  );
}
