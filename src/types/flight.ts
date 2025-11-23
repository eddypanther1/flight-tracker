export interface Flight {
    id: string;
    flightNumber: string;
    airline: string;
    origin: {
        code: string;
        city: string;
        time: string; // ISO string
        timezone: string;
    };
    destination: {
        code: string;
        city: string;
        time: string; // ISO string
        timezone: string;
    };
    status: 'On Time' | 'Delayed' | 'Cancelled';
}
