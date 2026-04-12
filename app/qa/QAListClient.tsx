'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Category } from '@/types/database';

interface QAItem {
    id: string;
    question_title: string;
    question_content?: string;
    answer_content: string;
    category_id: string | null;
    is_published: boolean;
    is_free: boolean;
    sort_order?: number;
    categories?: { name: string } | null;
}

interface Props {
    initialQAList: QAItem[];
    categories: Category[];
    currentCategory: string | null;
    initialQuery: string;
    isAdmin: boolean;
}

type SortOption = 'default' | 'title_asc' | 'category' ;

export default function QAListClient({ initialQAList, categories, currentCategory, initialQuery, isAdmin }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [qaList, setQaList] = useState(initialQAList);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(!!initialQuery);
    const [sortOption, setSortOption] = useState<SortOption>('default');

    // Sort the list based on selected option
    const sortedQaList = useMemo(() => {
        const list = [...qaList];

        // Helper function for case-insensitive, locale-aware sorting
        const compareStrings = (a: string, b: string) => {
            return a.toLowerCase().localeCompare(b.toLowerCase(), undefined, {
                numeric: true,
                sensitivity: 'base'
            });
        };

        switch (sortOption) {
            case 'title_asc':
                return list.sort((a, b) => compareStrings(a.question_title, b.question_title));
            
            case 'category':
                return list.sort((a, b) => {
                    const catA = a.categories?.name || 'zzz';
                    const catB = b.categories?.name || 'zzz';
                    return compareStrings(catA, catB);
                });
           
            default:
                return list; // Keep original sort_order
        }
    }, [qaList, sortOption]);

    // Update qaList when initialQAList changes (category filter)
    useEffect(() => {
        setQaList(initialQAList);
        setSearchQuery('');
        setHasSearched(false);
        setSortOption('default');
    }, [initialQAList, currentCategory]);

    // Debounced search
    useEffect(() => {
        if (searchQuery.trim().length < 2) {
            if (searchQuery.trim().length === 0 && hasSearched) {
                setQaList(initialQAList);
                setHasSearched(false);
            }
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const params = new URLSearchParams();
                params.set('q', searchQuery);
                if (currentCategory) {
                    params.set('cat', currentCategory);
                }

                const res = await fetch(`/api/search?${params.toString()}`);
                const data = await res.json();

                if (data.data) {
                    setQaList(data.data);
                    setHasSearched(true);
                }
            } catch (e) {
                console.error('Search error:', e);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, currentCategory, initialQAList, hasSearched]);

    // Highlight search terms in text
    const highlightText = useCallback((text: string, query: string) => {
        if (!query.trim() || query.length < 2) return text;

        const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
        return parts.map((part, i) =>
            part.toLowerCase() === query.toLowerCase()
                ? <mark key={i} className="bg-yellow-200 text-yellow-900 px-0.5 rounded">{part}</mark>
                : part
        );
    }, []);

    const getCategoryName = (item: QAItem) => {
        return item.categories?.name || '一般';
    };

    return (
        <div>
            {/* Title & Search Bar */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
    <h2 className="text-3xl font-bold text-foreground">
        {currentCategory
            ? categories.find(c => c.id === currentCategory)?.name
            : '税務Q&Aを探す'}
    </h2>

    {!currentCategory && (
        <p className="text-sm text-foreground-muted mt-1">
            カテゴリやキーワードから税務判断をすばやく確認できます。
        </p>
    )}

    {qaList.length > 0 && (
        <p className="text-sm text-foreground-muted mt-1">
            {qaList.length}件
        </p>
    )}
</div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        {isSearching ? (
                            <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        )}
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="キーワードで検索"
                        className="w-full pl-12 pr-4 py-4 bg-surface backdrop-blur border-2 border-gray-200 focus:border-primary rounded-2xl text-foreground placeholder-gray-400 outline-none transition-all focus:ring-4 focus:ring-indigo-100 text-lg"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setQaList(initialQAList);
                                setHasSearched(false);
                            }}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-foreground transition"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                {hasSearched && (
                    <p className="text-sm text-foreground-muted mt-3 flex items-center gap-2">
                        <span className="text-primary">✓</span>
                        「{searchQuery}」で {qaList.length}件の結果
                    </p>
                )}

                {/* Sort Controls */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="text-sm text-foreground-muted flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                        </svg>
                        並び替え:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                        <button
                            onClick={() => setSortOption('default')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${sortOption === 'default'
                                ? 'bg-primary text-white shadow-lg shadow-indigo-500/20'
                                : 'bg-surface text-foreground-muted hover:bg-surface-muted border border-border'
                                }`}
                        >
                            デフォルト
                        </button>
                        <button
                            onClick={() => setSortOption('title_asc')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${sortOption === 'title_asc'
                                ? 'bg-primary text-white shadow-lg shadow-indigo-500/20'
                                : 'bg-surface text-foreground-muted hover:bg-surface-muted border border-border'
                                }`}
                        >
                            タイトル順
                        </button>
                        
                        <button
                            onClick={() => setSortOption('category')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${sortOption === 'category'
                                ? 'bg-primary text-white shadow-lg shadow-indigo-500/20'
                                : 'bg-surface text-foreground-muted hover:bg-surface-muted border border-border'
                                }`}
                        >
                            カテゴリー順
                        </button>
                        
                    </div>
                </div>
            </div>

            {/* Q&A List */}
            <div className="space-y-4">
                {sortedQaList.map((item) => (
                    <Link href={`/qa/${item.id}`} key={item.id} className="block group">
                        <div className="relative bg-surface hover:bg-surface-muted backdrop-blur border-2 border-border hover:border-primary/30 p-6 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-lg">
                            {/* Status Indicator - Admin Only */}
                            {isAdmin && (
                                <div className="absolute -top-2 -right-2 z-10">
                                    {item.is_published ? (
                                        <div className="w-8 h-8 rounded-full bg-emerald-50 border-2 border-emerald-300 flex items-center justify-center" title="公開中">
                                            <span className="text-emerald-600 text-sm">⭕</span>
                                        </div>
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-red-50 border-2 border-red-300 flex items-center justify-center" title="非公開">
                                            <span className="text-red-600 text-sm">❌</span>
                                        </div>
                                    )}
                                </div>
                            )}

                           

                            {/* Tags */}
                            <div className="flex items-center mb-1 ">
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-primary border border-indigo-200">
                                
                                    {getCategoryName(item)}
                                </span>
                                
                                
                            </div>

　　　　　　　　　　　　　　　　　　　{/* Sub Label */}
<p className="text-sm font-medium text-foreground-muted mb-1">
    {hasSearched ? highlightText(item.question_title, searchQuery) : item.question_title}
</p>

{/* Main Question */}
{item.question_content && item.question_content.trim().length > 0 && (
    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-relaxed line-clamp-2">
        {hasSearched
            ? highlightText(item.question_content, searchQuery)
            : item.question_content}
    </h3>
)}

{/* Summary */}
<p className="text-sm leading-snug text-foreground-muted line-clamp-1">
    👉 {item.answer_content.slice(0, 30)}...
</p>

                            
                           
                 

                            {/* Arrow indicator */}
                            <div className="absolute right-6 bottom-6 text-gray-300 group-hover:text-primary transition-all group-hover:translate-x-1">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                ))}

                {qaList.length === 0 && (
                    <div className="text-center py-20 bg-surface-muted rounded-2xl border-2 border-dashed border-border">
                        <div className="text-6xl mb-4">🔍</div>
                        <p className="text-foreground-muted text-lg">
                            {hasSearched
                                ? `「${searchQuery}」に一致する質問が見つかりませんでした`
                                : 'このカテゴリーにはまだ質問がありません'
                            }
                        </p>
                        {hasSearched && (
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setQaList(initialQAList);
                                    setHasSearched(false);
                                }}
                                className="mt-4 px-6 py-2 bg-primary hover:bg-primary-hover rounded-xl text-white font-medium transition"
                            >
                                検索をクリア
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
