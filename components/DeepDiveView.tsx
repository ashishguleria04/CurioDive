import React from 'react';
import { DeepDiveItem } from '../types';
import { BackArrowIcon, ChevronRightIcon, LoaderIcon } from './icons';

interface DeepDiveViewProps {
  trail: DeepDiveItem[];
  isLoading: boolean;
  onFurtherDive: (topic: string) => void;
  onNavigateBack: (index: number) => void;
  onReturnToFeed: () => void;
}

export const DeepDiveView: React.FC<DeepDiveViewProps> = ({ trail, isLoading, onFurtherDive, onNavigateBack, onReturnToFeed }) => {
  const currentItem = trail[trail.length - 1];

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-8 animate-fade-in-slide-up">
        <div className="mb-8">
            <button onClick={onReturnToFeed} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white font-semibold transition-colors">
                <BackArrowIcon className="w-5 h-5" />
                Return to Feed
            </button>
        </div>

      <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-sm text-slate-400 mb-6 bg-gray-800 p-3 rounded-lg">
        <span className="font-semibold mr-1">Your Dive:</span>
        {trail.map((item, index) => (
          <React.Fragment key={index}>
            <button
              onClick={() => onNavigateBack(index)}
              disabled={index === trail.length - 1}
              className={`hover:underline transition-colors ${index === trail.length - 1 ? 'text-white font-bold' : 'text-slate-300'}`}
            >
              {item.title}
            </button>
            {index < trail.length - 1 && <ChevronRightIcon className="w-4 h-4 text-slate-400" />}
          </React.Fragment>
        ))}
      </div>
      
      {isLoading && trail.length > 0 && (
          <div className="flex flex-col items-center justify-center p-12 bg-gray-800 rounded-2xl shadow-lg">
              <LoaderIcon className="w-16 h-16"/>
              <p className="mt-4 text-lg font-medium text-slate-300">Diving deeper...</p>
          </div>
      )}

      {!isLoading && currentItem && (
        <div className="bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
            <article className="prose prose-lg prose-invert max-w-none">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{currentItem.title}</h1>
                <div className="leading-relaxed whitespace-pre-wrap">{currentItem.summary}</div>
            </article>

            {currentItem.sources && currentItem.sources.length > 0 && (
                <div className="mt-10 pt-6 border-t border-slate-700">
                    <h3 className="text-xl font-bold mb-4">Sources</h3>
                    <ul className="space-y-4">
                        {currentItem.sources.map((source, index) => (
                            <li key={index}>
                                <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white hover:underline font-semibold break-words">
                                    {source.title}
                                </a>
                                <span className="text-sm text-slate-400 block truncate mt-1">
                                    {source.url.replace(/^https?:\/\//, '')}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {currentItem.relatedTopics && currentItem.relatedTopics.length > 0 && (
                 <div className="mt-10 pt-6 border-t border-slate-700">
                    <h3 className="text-xl font-bold mb-4">Continue the Dive...</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {currentItem.relatedTopics.map((topic, index) => (
                        <button key={index} onClick={() => onFurtherDive(topic)} className="p-4 bg-gray-700/50 rounded-lg text-left hover:bg-gray-600 transition-colors group transform hover:scale-[1.03]">
                            <p className="font-semibold text-slate-200">{topic}</p>
                            <p className="text-sm text-slate-400 mt-1 font-medium group-hover:text-white group-hover:underline">Explore topic &rarr;</p>
                        </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
      )}
    </div>
  );
};