'use client';

import { useState } from 'react';

interface SearchFormProps {
    onSearch: (flightNumber: string) => void;
    isLoading: boolean;
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
    const [flightNumber, setFlightNumber] = useState('it207');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (flightNumber.trim()) {
            onSearch(flightNumber.trim());
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full flex justify-center">
            <div className="relative flex items-center bg-blue-50 rounded-full overflow-hidden w-full max-w-[480px] transition-all">
                <div className="flex-1 bg-white pl-6 pr-4 py-3">
                    <input
                        type="text"
                        value={flightNumber}
                        onChange={(e) => setFlightNumber(e.target.value)}
                        placeholder="AA100"
                        className="w-full bg-transparent text-slate-900 placeholder-slate-400 outline-none text-lg font-medium border-0 focus:ring-0"
                        disabled={isLoading}
                        style={{ border: 'none', outline: 'none' }}
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading || !flightNumber.trim()}
                    className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md active:scale-95 m-2"
                >
                    {isLoading ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    )}
                </button>
            </div>
        </form>
    );
}
