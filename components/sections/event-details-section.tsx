// components/sections/event-details-section.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { EVENTS } from '@/lib/constants';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';

export function EventDetailsSection() {
  const ref = useScrollAnimation<HTMLElement>();

  const events = [
    {
      ...EVENTS.traditionalMarriage,
      color: 'bg-gradient-to-br from-purple-50 to-pink-50',
      icon: Calendar,
    },
    {
      ...EVENTS.whitewedding,
      color: 'bg-gradient-to-br from-white to-purple-50',
      icon: Calendar,
      date: EVENTS.whitewedding.date,
    },
    {
      ...EVENTS.reception,
      color: 'bg-gradient-to-br from-pink-50 to-purple-50',
      icon: MapPin,
      date: EVENTS.whitewedding.date, // Reception is same day as white wedding
    },
  ];

  return (
    <section id="events" ref={ref} className="py-20 bg-white relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-cormorant font-bold mb-4 text-purple-700">
            Event Details
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-montserrat">
            Join us as we celebrate our union with traditional marriage, white wedding,
            and a joyous reception
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {events.map((event, index) => (
            <Card key={index} className={`${event.color} border-2 border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}>
              <CardHeader>
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                  <event.icon className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl font-cormorant font-bold text-center text-purple-800">
                  {event.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-center">
                {event.date && (
                  <div className="flex items-center justify-center gap-2 text-gray-700">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <span className="font-medium">{event.date}</span>
                  </div>
                )}
                <div className="flex items-center justify-center gap-2 text-gray-700">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <span className="font-medium">{event.time}</span>
                </div>
                <div className="flex items-start justify-center gap-2 text-gray-700">
                  <MapPin className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                  <span className="text-sm leading-relaxed">{event.venue}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl px-8 py-4 border-2 border-purple-300 shadow-lg">
            <p className="text-xl font-cormorant font-bold text-purple-800 mb-1">
              Dress Code
            </p>
            <p className="text-2xl font-great-vibes text-purple-700">
              Purple & White
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}