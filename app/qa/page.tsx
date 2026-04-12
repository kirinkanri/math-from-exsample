import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import Link from 'next/link';
import UserNav from '@/components/UserNav';
import { Category } from '@/types/database';
import QAListClient from './QAListClient';

export const dynamic = 'force-dynamic';

export default async function QAPage(props: { searchParams: Promise<{ cat?: string; q?: string }> }) {
    const searchParams = await props.searchParams;
    const session = await getServerSession(authOptions);

    // 🔐 ログインチェック
    if (!session?.user) {
        redirect('/login');
    }

    const BYPASS_SUBSCRIPTION_CHECK = false;

    // 👤 管理者チェック
    const { data: userData } = await supabaseAdmin
        .from('users')
        .select('is_admin')
        .eq('id', session.user.id)
        .single();

    // 💰 課金チェック（管理者以外）
    if (!userData?.is_admin && !BYPASS_SUBSCRIPTION_CHECK) {
        const { data: sub } = await supabaseAdmin
            .from('subscriptions')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

        // 未課金
        if (!sub) {
            redirect('/checkout');
        }

　　　　const now = new Date();

// cancel_atが無い場合は current_period_end を使う
const effectiveEnd =
    sub.cancel_at || sub.current_period_end;

const isAccessGranted =
    effectiveEnd && new Date(effectiveEnd) > now;

if (!isAccessGranted) {
    redirect('/checkout');
}
        
    }

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
                    <Link href="/qa" className="flex items-center gap-3">
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-hover">
                            LogicalTax
                        </h1>
                    </Link>

                    <div className="flex items-center gap-4">
                        {userData?.is_admin && (
                            <Link
                                href="/admin"
                                className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover !text-white text-sm font-medium"
                            >
                                管理画面へ
                            </Link>
                        )}
                        <UserNav user={{ name: session.user.name, email: session.user.email }} />
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8">
                <aside className="w-full lg:w-72">
                    <div className="lg:sticky lg:top-24">
                        <h3 className="text-sm font-bold mb-4">カテゴリー</h3>

                        <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto">
                            <Link
    href="/qa"
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
        href={`/qa?cat=${c.id}`}
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
                        isAdmin={userData?.is_admin || false}
                    />
                </main>
            </div>
        </div>
    );
}
