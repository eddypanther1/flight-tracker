import { NextResponse } from 'next/server';
import { fetchFlights } from '@/lib/aviation-stack';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
        return NextResponse.json([]);
    }

    const flights = await fetchFlights(query);
    return NextResponse.json(flights);
}
