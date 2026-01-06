'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CountdownTimer } from '@/components/countdown-timer';
import { Button } from '@/components/ui/button';
import { COUPLE, WEDDING_DATE } from '@/lib/constants';
import { Heart, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';

type FloatingHeart = {
  id: number;
  x: number;
  duration: number;
  delay: number;
  size: number;
};

export function HeroSection() {
  const isPastWedding = new Date() > WEDDING_DATE;

  const [floatingHearts] = useState<FloatingHeart[]>(() => {
    if (typeof window === 'undefined') return [];

    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      duration: 8 + Math.random() * 4,
      delay: Math.random() * 5,
      size: 20 + Math.random() * 30,
    }));
  });

  if (floatingHearts.length === 0) return null;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/images/couple-pouring-dring.png"
          alt="Wedding couple"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/80 via-purple-800/60 to-purple-50/95" />
      </div>

      {/* Floating Hearts */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        {floatingHearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="absolute"
            initial={{
              x: heart.x,
              y: window.innerHeight + 100,
              opacity: 0,
            }}
            animate={{
              y: -100,
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: heart.duration,
              repeat: Infinity,
              delay: heart.delay,
              ease: 'linear',
            }}
          >
            <Heart
              className="text-pink-300/30"
              fill="currentColor"
              size={heart.size}
            />
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center pt-20 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          {/* Wedding Theme */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="mb-8"
          >
            <div className="inline-block">
              <div className="flex items-center gap-4 mb-2">
                <div className="h-px w-12 bg-gradient-to-r from-transparent via-pink-300 to-pink-500" />
                <Heart className="w-6 h-6 text-pink-400 animate-pulse-soft" fill="currentColor" />
                <div className="h-px w-12 bg-gradient-to-l from-transparent via-pink-300 to-pink-500" />
              </div>
              <h2 className="font-great-vibes text-6xl md:text-8xl lg:text-9xl text-white drop-shadow-lg mb-2">
                SOMARV26
              </h2>
              <p className="text-sm md:text-base text-pink-200 font-semibold tracking-[0.3em] uppercase">
                Our Love Story
              </p>
            </div>
          </motion.div>

          {/* Couple Names */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
          >
            <h1 className="font-cormorant text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
              <span className="text-white drop-shadow-lg">{COUPLE.bride.name}</span>
              <span className="block text-3xl md:text-4xl my-4 font-great-vibes text-pink-200">
                &
              </span>
              <span className="text-white drop-shadow-lg">{COUPLE.groom.name}</span>
            </h1>
          </motion.div>

          {/* Date */}
          <motion.div
            className="flex items-center justify-center gap-3 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 1 }}
          >
            <Calendar className="w-5 h-5 text-pink-300" />
            <p className="text-xl md:text-2xl font-cormorant font-semibold text-white">
              {isPastWedding ? 'Married on January 11th, 2026' : '11th January, 2026'}
            </p>
          </motion.div>

          {/* Countdown / Gallery */}
          {!isPastWedding ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="mt-12"
            >
              <CountdownTimer />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="mt-12 space-y-4"
            >
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 max-w-md mx-auto shadow-2xl border-2 border-pink-200">
                <Heart className="w-16 h-16 text-purple-600 mx-auto mb-4 animate-pulse-soft" fill="currentColor" />
                <h3 className="text-3xl font-cormorant font-bold text-gray-800 mb-2">
                  We&apos;re Married! 🎉
                </h3>
                <p className="text-gray-600 mb-6">
                  Thank you for celebrating with us. Relive our special day in our gallery.
                </p>
                <Button asChild size="lg" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <Link href="/gallery" className="flex items-center justify-center gap-2">
                    View Our Gallery
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
