import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { CuriosityCard } from './components/CuriosityCard';
import { DeepDiveView } from './components/DeepDiveView';
import { getFeedItems, getDeepDive } from './services/geminiService';
import { CuriosityItem, DeepDiveItem } from './types';
import { CATEGORIES } from './constants';
import { LoaderIcon, ShuffleIcon, BookmarkIcon } from './components/icons';

type ViewMode = 'feed' | 'deepDive' | 'saved';

const App: React.FC = () => {
    const [viewMode, setViewMode] = useState<ViewMode>('feed');
    const [feedItems, setFeedItems] = useState<CuriosityItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deepDiveTrail, setDeepDiveTrail] = useState<DeepDiveItem[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>(CATEGORIES[0]);
    const [savedItems, setSavedItems] = useState<CuriosityItem[]>(() => {
        const saved = localStorage.getItem('curioDiveSaved');
        return saved ? JSON.parse(saved) : [];
    });

    const loadFeedItems = useCallback(async (category: string) => {
        setIsLoading(true);
        setFeedItems([]);
        const items = await getFeedItems(category);
        setFeedItems(items);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        loadFeedItems(activeCategory);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeCategory]);
    
    useEffect(() => {
        localStorage.setItem('curioDiveSaved', JSON.stringify(savedItems));
    }, [savedItems]);

    const handleShuffle = () => {
        const newCategory = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
        setActiveCategory(newCategory);
    };

    const handleDeepDive = async (item: CuriosityItem) => {
        setViewMode('deepDive');
        setIsLoading(true);
        setDeepDiveTrail([]);
        const deepDiveData = await getDeepDive(item.title);
        if (deepDiveData) {
            setDeepDiveTrail([deepDiveData]);
        }
        setIsLoading(false);
    };

    const handleFurtherDive = async (topic: string) => {
        setIsLoading(true);
        const deepDiveData = await getDeepDive(topic);
        if (deepDiveData) {
            setDeepDiveTrail(prev => [...prev, deepDiveData]);
        }
        setIsLoading(false);
    };
    
    const handleNavigateBack = (index: number) => {
        setDeepDiveTrail(prev => prev.slice(0, index + 1));
    };

    const handleSaveToggle = (itemToToggle: CuriosityItem) => {
        setSavedItems(prev => {
            const isSaved = prev.some(item => item.id === itemToToggle.id);
            if (isSaved) {
                return prev.filter(item => item.id !== itemToToggle.id);
            } else {
                return [...prev, itemToToggle];
            }
        });
    };
    
    const renderFeed = () => (
        <>
            <div className="sticky top-0 bg-gray-900/80 backdrop-blur-lg z-10 py-4 px-4 border-b border-slate-800">
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="w-full sm:w-auto flex-grow overflow-x-auto whitespace-nowrap pb-2 sm:pb-0 scrollbar-hide">
                        {CATEGORIES.map(category => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors mr-2 ${activeCategory === category ? 'bg-slate-200 text-gray-900 font-bold shadow' : 'bg-gray-800 hover:bg-gray-700'}`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                     <div className="flex items-center gap-2">
                        <button onClick={() => setViewMode('saved')} className="p-2.5 bg-gray-800 rounded-full text-slate-300 hover:bg-gray-700 transition-colors relative">
                            <BookmarkIcon className="w-5 h-5"/>
                            {savedItems.length > 0 && <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-xs text-gray-900 font-bold ring-2 ring-gray-900">{savedItems.length}</span>}
                        </button>
                        <button onClick={handleShuffle} disabled={isLoading} className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full text-sm font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            <ShuffleIcon className="w-5 h-5"/>
                            Shuffle
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {isLoading && feedItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64">
                         <LoaderIcon className="w-20 h-20"/>
                         <p className="mt-4 text-lg font-medium text-slate-400">Igniting curiosity...</p>
                    </div>
                ) : (
                    <div className="[column-count:1] md:[column-count:2] lg:[column-count:3] gap-6 space-y-6">
                        {feedItems.map(item => (
                            <CuriosityCard 
                                key={item.id} 
                                item={item} 
                                onDeepDive={handleDeepDive}
                                onSave={handleSaveToggle}
                                isSaved={savedItems.some(savedItem => savedItem.id === item.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );

    const renderSaved = () => (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">Saved Items</h2>
                <button onClick={() => setViewMode('feed')} className="text-slate-300 hover:underline font-semibold">
                    &larr; Back to Feed
                </button>
            </div>
            {savedItems.length === 0 ? (
                <div className="text-center py-16 bg-gray-800/50 rounded-lg">
                    <p className="text-slate-400">You haven't saved any items yet.</p>
                </div>
            ) : (
                <div className="[column-count:1] md:[column-count:2] lg:[column-count:3] gap-6 space-y-6">
                    {savedItems.map(item => (
                        <CuriosityCard 
                            key={item.id} 
                            item={item} 
                            onDeepDive={handleDeepDive}
                            onSave={handleSaveToggle}
                            isSaved={true}
                        />
                    ))}
                </div>
            )}
        </div>
    )

    return (
        <div className="min-h-screen">
            <Header />
            <main>
                {viewMode === 'feed' && renderFeed()}
                {viewMode === 'saved' && renderSaved()}
                {viewMode === 'deepDive' && (
                    <DeepDiveView 
                        trail={deepDiveTrail} 
                        isLoading={isLoading}
                        onFurtherDive={handleFurtherDive}
                        onNavigateBack={handleNavigateBack}
                        onReturnToFeed={() => setViewMode('feed')}
                    />
                )}
            </main>
        </div>
    );
};

export default App;