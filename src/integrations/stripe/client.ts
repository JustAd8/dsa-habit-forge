import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
  console.warn('VITE_STRIPE_PUBLISHABLE_KEY is not set. Stripe functionality will not work.');
}

export { stripePromise };
export default stripePromise;
