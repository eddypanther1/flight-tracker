import { Flight } from '@/types/flight';

interface FlightCardProps {
    flight: Flight;
}

export function FlightCard({ flight }: FlightCardProps) {
    const formatTime = (time: string, timezone: string) => {
        return new Date(time).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: timezone,
            timeZoneName: 'short',
        });
    };

    const formatDate = (time: string, timezone: string) => {
        return new Date(time).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            timeZone: timezone,
        });
    };

    const getStatusColor = (status: Flight['status']) => {
        switch (status) {
            case 'On Time':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'Delayed':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Cancelled':
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const generateGoogleCalendarUrl = () => {
        // Format dates for Google Calendar (YYYYMMDDTHHmmssZ format)
        const formatForCalendar = (dateString: string) => {
            const date = new Date(dateString);
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };

        const startTime = formatForCalendar(flight.origin.time);
        const endTime = formatForCalendar(flight.destination.time);

        const title = `${flight.airline} ${flight.flightNumber}`;
        const location = `${flight.origin.city} (${flight.origin.code}) to ${flight.destination.city} (${flight.destination.code})`;
        const details = `Flight: ${flight.flightNumber}\nAirline: ${flight.airline}\nDeparture: ${flight.origin.city} (${flight.origin.code}) at ${formatTime(flight.origin.time, flight.origin.timezone)}\nArrival: ${flight.destination.city} (${flight.destination.code}) at ${formatTime(flight.destination.time, flight.destination.timezone)}\nStatus: ${flight.status}`;

        const params = new URLSearchParams({
            action: 'TEMPLATE',
            text: title,
            dates: `${startTime}/${endTime}`,
            details: details,
            location: location,
        });

        return `https://calendar.google.com/calendar/render?${params.toString()}`;
    };

    return (
        <a
            href={generateGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden cursor-pointer transition-shadow hover:shadow-[0_12px_40px_rgb(0,0,0,0.18)]"
        >
            {/* Header */}
            <div className="flex items-center gap-4 px-8 py-6 bg-slate-50">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    <svg className="w-6 h-6 transform -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900">{flight.airline}</h3>
                    <p className="text-slate-400 text-sm font-medium">{flight.flightNumber}</p>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-2 gap-12 px-16 py-16">
                {/* Origin */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-blue-500 font-medium text-sm">
                        <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Origin
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-slate-900">{flight.origin.code}</div>
                        <div className="text-slate-500 text-sm mt-1">{flight.origin.city}</div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-medium pt-2">
                        <svg style={{ width: '12px', height: '12px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatTime(flight.origin.time, flight.origin.timezone)} {new Date(flight.origin.time).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                </div>

                {/* Destination */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-400 font-medium text-sm">
                        <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Destination
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-slate-900">{flight.destination.code}</div>
                        <div className="text-slate-500 text-sm mt-1">{flight.destination.city}</div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-medium pt-2">
                        <svg style={{ width: '12px', height: '12px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatTime(flight.destination.time, flight.destination.timezone)} {new Date(flight.destination.time).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                </div>
            </div>
        </a>
    );
}
