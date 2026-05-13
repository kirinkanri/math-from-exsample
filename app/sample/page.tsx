
import { supabaseAdmin } from '@/lib/supabase';
import Link from 'next/link';

import { Category } from '@/types/database';
import QAListClient from '../qa/QAListClient';

export const dynamic = 'force-dynamic';

export default async function QAPage(props: { searchParams: Promise<{ cat?: string; q?: string }> }) {
    const searchParams = await props.searchParams;
    
        
    

    // ------------------------
    // データ取得
    // ------------------------

    const { cat, q } = searchParams;

    const { data: categories } = await supabaseAdmin
        .from('categories')
        .select('*')
        .order('sort_order') as { data: Category[] | null };

    let qaQuery = supabaseAdmin
        .from('qa')
        .select('id, question_title, question_content, answer_content, category_id, is_published, is_free, sort_order, categories(name)')
        .eq('is_published', true);

    if (cat) {
        qaQuery = qaQuery.eq('category_id', cat);
    }

    if (q && q.trim().length >= 2) {
        qaQuery = qaQuery.or(`question_title.ilike.%${q}%,question_content.ilike.%${q}%,answer_content.ilike.%${q}%`);
    }

    qaQuery = qaQuery
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

    const { data: qaList } = await qaQuery;

    // ------------------------
    // UI
    // ------------------------

    return (
        <div className="min-h-screen">
            <header className="bg-surface/80 backdrop-blur-xl border-b border-border p-4 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex flex-col items-start gap-1">
                    <Link href="/sample" className="flex items-center gap-3">
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-hover">
                            具体例でわかる数学（無料体験）
                        </h1>
                    </Link>
　　　　　　　　　　<Link
                href="/"
                className="text-sm text-foreground-muted hover:text-primary transition-colors"
            >
                ← トップページへ戻る
            </Link>
　　　　　　　　　　</div>
                    <div className="flex items-center gap-4">
                        
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8">
                <aside className="w-full lg:w-72">
                    <div className="lg:sticky lg:top-24">
                        <h3 className="text-sm font-bold mb-4">カテゴリー</h3>

                        <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto">
                            <Link
    href="/sample"
    className={`px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all border ${
        !cat
            ? 'bg-primary !text-white border-transparent shadow-lg shadow-indigo-500/20'
            : 'bg-surface text-foreground-muted hover:bg-surface-muted border-border hover:border-gray-300'
    }`}
>
    <span className="flex items-center gap-2">
        <span className="text-lg">📋</span>
        すべての質問
    </span>
</Link>

{categories?.map((c) => (
    <Link
        key={c.id}
        href={`/sample?cat=${c.id}`}
        className={`px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all border ${
            cat === c.id
                ? 'bg-primary !text-white border-transparent shadow-lg shadow-indigo-500/20'
                : 'bg-surface text-foreground-muted hover:bg-surface-muted border-border hover:border-gray-300'
        }`}
    >
        {c.name}
    </Link>
))}
                        </div>
                    </div>
                </aside>

                <main className="flex-1">
                    <QAListClient
                        key={cat || 'all'}
                        initialQAList={qaList || []}
                        categories={categories || []}
                        currentCategory={cat || null}
                        initialQuery={q || ''}
                        isAdmin={false}
                        isSample={true}
                    />
                </main>
            </div>
        </div>
    );
}
