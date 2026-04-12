import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Resolve our internal user_id from a Stripe customer ID.
 * Returns null if no matching user is found.
 */
async function resolveUserId(stripeCustomerId: string): Promise<string | null> {
    const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('stripe_customer_id', stripeCustomerId)
        .maybeSingle();

    if (error) {
        console.error('Error resolving user_id from stripe_customer_id:', error.message);
        return null;
    }
    return user?.id ?? null;
}

export async function POST(req: NextRequest) {
    const body = await req.text();
    const headersList = await headers(); // Prepare for Next.js 15+ if needed, or strict typing
    const signature = headersList.get('Stripe-Signature') as string;

    let event: Stripe.Event;

    try {
        if (!process.env.STRIPE_WEBHOOK_SECRET) {
            console.warn('STRIPE_WEBHOOK_SECRET is missing. Skipping webhook signature verification.');
            return new NextResponse('Webhook ignored (missing secret)', { status: 200 });
        }

        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error: any) {
        console.error(`Webhook Error: ${error.message}`);
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    try {
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;
            const subscriptionId = session.subscription as string;
            const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId) as Stripe.Subscription;

            // We assume userId is passed in metadata during checkout creation
            const userId = session.metadata?.userId;

            if (userId) {
                const currentPeriodEnd = stripeSubscription.items.data[0].current_period_end;
                await supabaseAdmin.from('subscriptions').upsert({
                    id: subscriptionId,
                    user_id: userId,
                    status: stripeSubscription.status,
                    price_id: stripeSubscription.items.data[0].price.id,
                    cancel_at_period_end: stripeSubscription.cancel_at_period_end,
                    cancel_at: stripeSubscription.cancel_at ? new Date(stripeSubscription.cancel_at * 1000).toISOString() : null,
                    canceled_at: stripeSubscription.canceled_at ? new Date(stripeSubscription.canceled_at * 1000).toISOString() : null,
                    current_period_end: currentPeriodEnd ? new Date(currentPeriodEnd * 1000).toISOString() : null,
                });

                // Update customer ID in users table
                if (session.customer) {
                    await supabaseAdmin.from('users').update({
                        stripe_customer_id: session.customer as string
                    }).eq('id', userId);
                }
            }
        } else if (event.type === 'customer.subscription.updated') {
            const subscription = event.data.object as Stripe.Subscription;
            const currentPeriodEnd = subscription.items.data[0].current_period_end;

            // Resolve user_id so we can upsert (handles pre-existing accounts without a row)
            const userId = await resolveUserId(subscription.customer as string);

            if (userId) {
                const { error: upsertError } = await supabaseAdmin.from('subscriptions').upsert({
                    id: subscription.id,
                    user_id: userId,
                    status: subscription.status,
                    price_id: subscription.items.data[0].price.id,
                    cancel_at_period_end: subscription.cancel_at_period_end,
                    cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000).toISOString() : null,
                    canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
                    current_period_end: currentPeriodEnd ? new Date(currentPeriodEnd * 1000).toISOString() : null,
                });
                if (upsertError) {
                    console.error('Supabase upsert error (subscription.updated):', upsertError.message);
                }
            } else {
                console.warn(`Could not resolve user_id for Stripe customer ${subscription.customer}. Skipping upsert.`);
            }

        } else if (event.type === 'customer.subscription.deleted') {
            const subscription = event.data.object as Stripe.Subscription;
            const currentPeriodEnd = subscription.items.data[0].current_period_end;

            const userId = await resolveUserId(subscription.customer as string);

            if (userId) {
                const { error: upsertError } = await supabaseAdmin.from('subscriptions').upsert({
                    id: subscription.id,
                    user_id: userId,
                    status: subscription.status,
                    price_id: subscription.items.data[0].price.id,
                    cancel_at_period_end: subscription.cancel_at_period_end,
                    cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000).toISOString() : null,
                    canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
                    current_period_end: currentPeriodEnd ? new Date(currentPeriodEnd * 1000).toISOString() : null,
                });
                if (upsertError) {
                    console.error('Supabase upsert error (subscription.deleted):', upsertError.message);
                }
            } else {
                console.warn(`Could not resolve user_id for Stripe customer ${subscription.customer}. Skipping upsert.`);
            }
        }
    } catch (err: any) {
        console.error('Error handling webhook event:', err.message);
        return new NextResponse('Internal Server Error', { status: 500 });
    }

    return new NextResponse(null, { status: 200 });
}