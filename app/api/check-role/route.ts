import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({ redirectTo: '/login' });
    }

    // Check Admin Status
    const { data: user } = await supabaseAdmin
        .from('users')
        .select('is_admin')
        .eq('id', session.user.id)
        .single();

    if (user?.is_admin) {
        return NextResponse.json({ redirectTo: '/admin' });
    }

    // Check Subscription Status
    const { data: subscription } = await supabaseAdmin
        .from('subscriptions')
        .select('status, current_period_end, cancel_at')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (subscription) {
        const now = new Date();
        const isActive = ['active', 'trialing'].includes(subscription.status);
        const isCanceledButValid = subscription.status === 'canceled'
            && subscription.current_period_end
            && new Date(subscription.current_period_end) > now;
        const hasFutureCancelAt = subscription.cancel_at
            && new Date(subscription.cancel_at) > now;

        if (isActive || isCanceledButValid || hasFutureCancelAt) {
            return NextResponse.json({ redirectTo: '/qa' });
        }
    }

    return NextResponse.json({ redirectTo: '/checkout' });
}