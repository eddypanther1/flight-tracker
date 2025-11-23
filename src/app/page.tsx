'use client';

import { useState } from 'react';
import { Flight } from '@/types/flight';
import { SearchForm } from '@/components/SearchForm';
import { FlightCard } from '@/components/FlightCard';

export default function Home() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (flightNumber: string) => {
    setIsLoading(true);
    setHasSearched(true);
    setFlights([]);

    try {
      const response = await fetch(`/api/flights?query=${encodeURIComponent(flightNumber)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch flights');
      }
      const data = await response.json();
      setFlights(data);
    } catch (error) {
      console.error('Error fetching flights:', error);
      // Ideally handle error state here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl flex flex-col items-center text-center space-y-8 mb-12">
        {/* Logo */}
        <div className="w-24 h-24 mb-6 relative animate-float">
          <img src="/icon.svg" alt="Flight Tracker Logo" className="w-full h-full drop-shadow-xl" />
        </div>

        <div className="space-y-2">
          <h1 className="text-5xl font-bold text-slate-900 tracking-tight">
            Flight Tracker
          </h1>
          <p className="text-slate-500 text-lg font-medium">
            Track any flight, anytime, anywhere.
          </p>
        </div>

        <div className="w-full flex justify-center pt-4">
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />
        </div>
      </div>

      {/* Results Section */}
      {(hasSearched || flights.length > 0) && (
        <div className="w-3/5 mx-auto mt-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
            </div>
          ) : hasSearched && flights.length === 0 ? (
            <div className="text-center py-8 text-slate-500 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-lg font-medium text-slate-900">No flights found</p>
              <p className="mt-1">We couldn't find any flights matching that number.</p>
            </div>
          ) : (
            flights.map((flight) => (
              <FlightCard key={flight.id} flight={flight} />
            ))
          )}
        </div>
      )
      }
    </main >
  );
}
