import { stripePromise } from '@/integrations/stripe/client';

export class PaymentService {
  static async createCheckoutSession(priceId: string, userId: string) {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId,
        }),
      });

      const session = await response.json();
      return session;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  static async redirectToCheckout(sessionId: string) {
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe failed to initialize');
    }

    // Use type assertion to access redirectToCheckout
    const { error } = await (stripe as any).redirectToCheckout({
      sessionId,
    });

    if (error) {
      console.error('Error redirecting to checkout:', error);
      throw error;
    }
  }

  static async handleSubscription(priceId: string, userId: string) {
    try {
      const session = await this.createCheckoutSession(priceId, userId);
      await this.redirectToCheckout(session.id);
    } catch (error) {
      console.error('Error handling subscription:', error);
      throw error;
    }
  }
}
