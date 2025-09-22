import React from 'react';
import { SparklesIcon } from './icons';

export const Header: React.FC = () => {
    return (
        <header className="text-center py-8 px-4 relative">
            <div className="flex items-center justify-center gap-2 mb-2">
                <SparklesIcon className="w-8 h-8 text-slate-200"/>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-100">
                    CurioDive
                </h1>
            </div>
            <p className="text-slate-400 max-w-md mx-auto">
                Your daily curiosity spark — one scroll away. Dive deep when you’re ready.
            </p>
        </header>
    );
};