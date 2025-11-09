import Stripe from 'stripe';
import { supabase } from '@/integrations/supabase/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }

  const { priceId, userId } = req.body;

  try {
    // Get user from Supabase to ensure they exist
    const { data: user, error: userError } = await supabase.auth.admin.getUserById(userId);

    if (userError || !user) {
      return res.status(400).json({ error: 'Invalid user' });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/premium?canceled=true`,
      client_reference_id: userId,
      metadata: {
        userId: userId,
      },
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
