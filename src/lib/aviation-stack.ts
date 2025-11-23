import { Flight } from '@/types/flight';

const API_KEY = process.env.AVIATION_STACK_API_KEY;
const BASE_URL = 'http://api.aviationstack.com/v1';

interface AviationStackFlight {
    flight_date: string;
    flight_status: string;
    departure: {
        airport: string;
        timezone: string;
        iata: string;
        icao: string;
        terminal: string | null;
        gate: string | null;
        delay: number | null;
        scheduled: string;
        estimated: string;
        actual: string | null;
        estimated_runway: string | null;
        actual_runway: string | null;
    };
    arrival: {
        airport: string;
        timezone: string;
        iata: string;
        icao: string;
        terminal: string | null;
        gate: string | null;
        baggage: string | null;
        scheduled: string;
        delay: number | null;
        estimated: string | null;
        actual: string | null;
        estimated_runway: string | null;
        actual_runway: string | null;
    };
    airline: {
        name: string;
        iata: string;
        icao: string;
    };
    flight: {
        number: string;
        iata: string;
        icao: string;
        codeshared: any;
    };
    aircraft: any;
    live: any;
}

interface AviationStackResponse {
    pagination: {
        limit: number;
        offset: number;
        count: number;
        total: number;
    };
    data: AviationStackFlight[];
}

export async function fetchFlights(query: string): Promise<Flight[]> {
    if (!query) return [];

    try {
        const url = `${BASE_URL}/flights?access_key=${API_KEY}&flight_iata=${query}`;
        console.log('Fetching URL:', url);
        const response = await fetch(url);

        console.log('Response Status:', response.status);
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data: AviationStackResponse = await response.json();
        console.log('API Data Count:', data.data?.length);

        if (!data.data) {
            return [];
        }

        return data.data.map((flight) => ({
            id: `${flight.flight.iata}-${flight.flight_date}`,
            flightNumber: flight.flight.iata,
            airline: flight.airline.name,
            origin: {
                code: flight.departure.iata,
                city: flight.departure.airport, // API returns airport name, not city, but it's the best proxy we have
                time: flight.departure.scheduled,
                timezone: flight.departure.timezone,
            },
            destination: {
                code: flight.arrival.iata,
                city: flight.arrival.airport,
                time: flight.arrival.scheduled,
                timezone: flight.arrival.timezone,
            },
            status: mapStatus(flight.flight_status),
        }));
    } catch (error) {
        console.error('Failed to fetch flights:', error);
        return [];
    }
}

function mapStatus(apiStatus: string): Flight['status'] {
    switch (apiStatus.toLowerCase()) {
        case 'active':
        case 'scheduled':
        case 'landed':
            return 'On Time'; // Simplified mapping
        case 'cancelled':
            return 'Cancelled';
        case 'incident':
        case 'diverted':
            return 'Delayed';
        default:
            return 'On Time';
    }
}
