import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        // Retrieve Stripe Customer ID from user profile
        const { data: user, error } = await supabaseAdmin
            .from('users')
            .select('stripe_customer_id')
            .eq('id', session.user.id)
            .single();

        if (error || !user?.stripe_customer_id) {
            console.error('Error fetching user customer ID:', error);
            return NextResponse.json({ error: "Stripe customer not found" }, { status: 404 });
        }

        // Determine base URL safely
        let baseUrl = process.env.NEXTAUTH_URL;
        if (!baseUrl) {
            const protocol = req.headers.get('x-forwarded-proto') ?? 'http';
            const host = req.headers.get('host') ?? 'localhost:3000';
            baseUrl = `${protocol}://${host}`;
        } else if (!baseUrl.startsWith('http')) {
            baseUrl = `https://${baseUrl}`;
        }

        // Create a customer portal session
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: user.stripe_customer_id,
            return_url: `${baseUrl}/`, // Return back to Home Page
        });

        return NextResponse.redirect(portalSession.url, 303);
    } catch (error: any) {
        console.error('Stripe Customer Portal error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
