# TODO: Fix Google OAuth and Payment Gateway

## Google OAuth Issues
- [ ] Enable Google OAuth in Supabase project (Authentication > Providers > Google)
- [ ] Add correct redirect URLs in Supabase OAuth settings
- [ ] Test Google login functionality

## Payment Gateway Issues
- [ ] Add VITE_STRIPE_PUBLISHABLE_KEY to .env file
- [ ] Set up Vercel environment variables for Stripe
- [ ] Create actual Stripe price ID (replace price_placeholder)
- [ ] Set up Stripe webhook endpoints for subscription management
- [ ] Create API route for /api/create-checkout-session
- [ ] Test payment flow end-to-end

## Environment Variables Needed
- VITE_STRIPE_PUBLISHABLE_KEY
- STRIPE_SECRET_KEY (for backend)
- STRIPE_WEBHOOK_SECRET (for webhooks)

## Files to Modify
- .env (add Stripe keys)
- src/pages/Premium.tsx (update price ID)
- Create API route for checkout session
- Vercel environment variables
