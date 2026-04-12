import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import UserNav from "@/components/UserNav";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export default async function MyPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    // Fetch user profile and subscription data
    const { data: user } = await supabaseAdmin
        .from('users')
        .select('stripe_customer_id')
        .eq('id', session.user.id)
        .single();

    const { data: subscription } = await supabaseAdmin
        .from('subscriptions')
        .select('status, cancel_at_period_end, cancel_at, canceled_at, current_period_end')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    // Determine display status
    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
    };

    const isCancellationScheduled = subscription?.cancel_at && new Date(subscription.cancel_at) > new Date();
    const isCanceled = subscription?.status === 'canceled';
    const isActive = subscription?.status === 'active' || subscription?.status === 'trialing';

    {/* 後付けログイン制限、cancel_atで機能、statusはみない。 */}
    
    const isValidSubscription =
    subscription?.cancel_at &&
    new Date() < new Date(subscription.cancel_at);


    


    
    
    return (
        <div className="min-h-screen bg-surface-muted">
            {/* Header */}
            <header className="bg-surface/80 backdrop-blur-xl border-b border-border p-4 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link href="/qa" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <span className="text-white font-bold text-lg">L</span>
                        </div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-hover">
                            LogicalTax
                        </h1>
                    </Link>
                    <div className="flex items-center gap-4">
                        <UserNav user={{ name: session.user.name, email: session.user.email }} />
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto p-4 md:p-8 mt-8">
                <h2 className="text-2xl font-bold mb-6">マイページ</h2>

                <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-foreground-muted uppercase tracking-wider mb-2">アカウント情報</h3>
                        <p className="text-foreground font-medium">{session.user.name || 'ユーザー'}</p>
                        <p className="text-foreground-muted text-sm">{session.user.email}</p>
                    </div>

                    <div className="border-t border-border pt-6">
                        <h3 className="text-sm font-semibold text-foreground-muted uppercase tracking-wider mb-4">サブスクリプション管理</h3>

                        {/* Subscription Status Display */}
                        {subscription && (
                            <div className="mb-4">
                                {isActive && !isCancellationScheduled && (
                                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>ステータス: <strong>有効</strong></span>
                                        {subscription.current_period_end && (
                                            <span className="ml-2">（次回更新日: {formatDate(subscription.current_period_end)}）</span>
                                        )}
                                    </div>
                                )}

                                {isActive && isCancellationScheduled && (
                                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm">
                                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                        <span>解約予約済み: <strong>{formatDate(subscription.cancel_at!)}</strong> に解約されます</span>
                                    </div>
                                )}

                                {isCanceled && (
                                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>ステータス: <strong>解約済み</strong></span>
                                        {subscription.current_period_end && new Date(subscription.current_period_end) > new Date() && (
                                            <span className="ml-2">（{formatDate(subscription.current_period_end)} まで利用可能）</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {user?.stripe_customer_id ? (
                            <div>
                                <p className="text-sm text-foreground-muted mb-4">
                                    プランの確認、変更、または期間満了時の解約手続きは、以下のStripe Customer Portalから行えます。
                                </p>
                                <form action="/api/create-portal-session" method="POST">
                                    <button
                                        type="submit"
                                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                                    >
                                        プラン管理・解約手続き (Stripe)
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="text-sm text-foreground-muted">
                                <p className="mb-4">現在、有効なサブスクリプション情報が見つかりません。</p>
                                <Link href="/checkout" className="text-primary hover:text-primary-hover font-medium underline">
                                    サブスクリプションに登録する
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
