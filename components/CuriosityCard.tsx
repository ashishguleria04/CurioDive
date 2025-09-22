import React from 'react';
import { CuriosityItem } from '../types';
import { BookmarkIcon, RabbitIcon } from './icons';

interface CuriosityCardProps {
    item: CuriosityItem;
    onDeepDive: (item: CuriosityItem) => void;
    onSave: (item: CuriosityItem) => void;
    isSaved: boolean;
}

export const CuriosityCard: React.FC<CuriosityCardProps> = ({ item, onDeepDive, onSave, isSaved }) => {

    return (
        <div 
            style={{ breakInside: 'avoid' }} 
            className="bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl hover:shadow-slate-900/50 transition-all duration-300 ease-in-out hover:-translate-y-1.5 flex flex-col overflow-hidden relative border border-slate-700"
        >
            <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-3">
                    <div className="font-semibold text-xs uppercase tracking-wider text-slate-400">
                        {item.category}
                    </div>
                    <button
                        onClick={() => onSave(item)}
                        className={`p-1.5 rounded-full transition-colors ${isSaved ? 'text-white bg-gray-600' : 'text-slate-400 hover:bg-slate-700'}`}
                        aria-label={isSaved ? "Unsave item" : "Save item"}
                    >
                        <BookmarkIcon className="w-5 h-5" />
                    </button>
                </div>
                
                <h3 className="text-xl font-bold text-slate-100 mb-2">{item.title}</h3>
                
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    {item.blurb}
                </p>
            </div>
            
            <div className="px-6 pb-6 mt-auto">
                <a href={item.source} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 hover:text-white transition-colors truncate mb-4 block">
                    Source: {item.source.replace(/^https?:\/\//, '').split('/')[0]}
                </a>

                <button
                    onClick={() => onDeepDive(item)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-200 text-gray-900 rounded-full text-sm font-semibold hover:bg-white transition-all transform hover:scale-[1.02]"
                >
                    Deep Dive
                    <RabbitIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};