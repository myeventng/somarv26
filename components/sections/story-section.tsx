// components/sections/story-section.tsx
'use client';

import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import Image from 'next/image';

export function StorySection() {
  const ref = useScrollAnimation<HTMLElement>();

  return (
    <section id="story" ref={ref} className="py-20 bg-gradient-to-b from-white to-purple-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-center mb-16 text-primary">
          Our Love Story
        </h2>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-2xl">
              <Image
                src="/assets/images/couple-in-wedding-gown-looking-eye-to-eye.png"
                alt="Couple looking at each other"
                fill
                className="object-cover"
              />
            </div>
            
            <div className="space-y-6 text-gray-700">
              <p className="text-lg leading-relaxed">
                Our journey began with a chance meeting that blossomed into an
                unbreakable bond. From the first moment we met, we knew there was
                something special between us.
              </p>
              
              <p className="text-lg leading-relaxed">
                Through laughter, adventures, and countless memories, our love has
                grown stronger each day. Together, we&apos;ve discovered what it truly means
                to be partners in life.
              </p>
              
              <p className="text-lg leading-relaxed">
                Now, we&apos;re ready to take the next step in our journey together, and we
                canvt wait to celebrate with all of you on our special day!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
