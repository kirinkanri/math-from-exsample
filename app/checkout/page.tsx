'use client';

import { useSession, signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense, useEffect } from 'react';

function CheckoutContent() {
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const canceled = searchParams.get('canceled');
    const success = searchParams.get('success');

    const sessionId = searchParams.get('session_id');

    // Redirect to login if not authenticated
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login?redirect=/checkout');
        }
    }, [status, router]);

    // Handle success (from Stripe Checkout)
    useEffect(() => {
        let isCancelled = false;
        let pollCount = 0;
        const maxPolls = 20; // 20 * 3s = 60s timeout

        const checkSubscriptionStatus = async () => {
            if (success === 'true' && session && !isCancelled) {
                setLoading(true); // Reuse loading state for UI feedback
                try {
                    const res = await fetch('/api/confirm-payment', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ session_id: sessionId })
                    });
                    const data = await res.json();

                    if (data.active) {
                        router.push('/qa');
                    } else if (pollCount < maxPolls) {
                        pollCount++;
                        setTimeout(checkSubscriptionStatus, 3000); // Poll every 3 seconds
                    } else {
                        setLoading(false);
                        alert('お支払いの確認に時間がかかっています。しばらくしてから再度アクセスしてください。');
                    }
                } catch (e) {
                    console.error('Error checking payment:', e);
                    setLoading(false);
                }
            }
        };

        if (success === 'true' && session) {
            checkSubscriptionStatus();
        }

        return () => { isCancelled = true; };
    }, [success, session, router]);

    const handleSubscribe = async () => {
        if (!session) {
            signIn();
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/create-checkout-session', {
                method: 'POST',
            });
            const data = await res.json();

            if (data.url) {
                // Redirect to Stripe Checkout
                window.location.href = data.url;
            } else if (data.error) {
                alert('エラー: ' + data.error);
                setLoading(false);
            } else {
                alert('支払いの開始に失敗しました。もう一度お試しください。');
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
            alert('エラーが発生しました。もう一度お試しください。');
            setLoading(false);
        }
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Don't render content if not authenticated (will redirect)
    if (status === 'unauthenticated') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/30 rounded-full mix-blend-multiply filter blur-[128px] opacity-50"></div>
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200/30 rounded-full mix-blend-multiply filter blur-[128px] opacity-50"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-pink-200/30 rounded-full mix-blend-multiply filter blur-[128px] opacity-50"></div>
            </div>

            <div className="z-10 w-full max-w-md">
                {success && (
                    <div className="mb-6 bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg backdrop-blur-sm text-center">
                        🎉 お支払いが完了しました！Q&Aページにリダイレクトしています...
                    </div>
                )}

                {canceled && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg backdrop-blur-sm">
                        支払いがキャンセルされました。準備ができ次第、再度お試しください。
                    </div>
                )}

                <div className="bg-surface/80 backdrop-blur-xl border border-border p-8 rounded-2xl shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-hover mb-2">
                            LogicalTax
                        </h1>
                        <p className="text-foreground-muted">税務判断をサポートする。</p>
                    </div>

                    <div className="mb-8">
                        <div className="flex items-baseline justify-center mb-4">
                            <span className="text-5xl font-extrabold text-foreground">¥6,000</span>
                            <span className="text-xl text-foreground-muted ml-2">/月</span>
                        </div>
                        <p className="text-center text-sm text-foreground-muted">いつでもキャンセル可能。</p>
                    </div>

                    <ul className="space-y-4 mb-8">
                        {['1契約で、同一法人内利用可', '税務判断を論理で説明したい', 'グレー論点を構造で整理したい', '顧客説明を論理的に強化したい'].map((feature) => (
                            <li key={feature} className="flex items-center text-foreground-muted">
                                <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                {feature}
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={handleSubscribe}
                        disabled={loading}
                        className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-indigo-900 text-white font-semibold shadow-lg shadow-indigo-500/20 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? '処理中...' : session ? '今すぐ登録する' : 'ログインして登録する'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}


