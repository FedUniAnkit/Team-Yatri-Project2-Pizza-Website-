# Stripe Payment Integration Setup Guide

This guide will help you set up Stripe payment gateway for online payments in the Pizza Order application.

## Prerequisites

1. A Stripe account (sign up at https://stripe.com)
2. Node.js and npm installed
3. The application running locally

## Setup Steps

### 1. Get Stripe API Keys

1. Log in to your Stripe Dashboard: https://dashboard.stripe.com
2. Navigate to **Developers** → **API keys**
3. Copy your **Publishable key** (starts with `pk_test_` for test mode)
4. Copy your **Secret key** (starts with `sk_test_` for test mode)

### 2. Configure Server Environment Variables

1. Navigate to the `server` directory
2. Create a `.env` file (or copy from `.env.example`)
3. Add your Stripe keys:

```env
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 3. Configure Client Environment Variables

1. Navigate to the `client` directory
2. Create a `.env` file (or copy from `.env.example`)
3. Add your Stripe publishable key:

```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
```

### 4. Set Up Stripe Webhooks (Optional for Development)

Webhooks allow Stripe to notify your server about payment events.

#### For Local Development (using Stripe CLI):

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login to Stripe CLI:
   ```bash
   stripe login
   ```
3. Forward webhook events to your local server:
   ```bash
   stripe listen --forward-to localhost:5000/api/payment/webhook
   ```
4. Copy the webhook signing secret (starts with `whsec_`) and add it to your server `.env` file

#### For Production:

1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter your webhook URL: `https://yourdomain.com/api/payment/webhook`
4. Select events to listen to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the webhook signing secret and add it to your production environment variables

### 5. Database Migration

The Order model has been updated to include a `stripePaymentIntentId` field. If you're using an existing database, you may need to run a migration or manually add this column:

```sql
ALTER TABLE "Orders" ADD COLUMN "stripePaymentIntentId" VARCHAR(255);
```

### 6. Restart the Application

1. Restart the server:
   ```bash
   cd server
   npm run dev
   ```

2. Restart the client:
   ```bash
   cd client
   npm start
   ```

## Testing the Integration

### Using Test Cards

Stripe provides test card numbers for testing different scenarios:

- **Successful payment**: `4242 4242 4242 4242`
- **Payment requires authentication**: `4000 0025 0000 3155`
- **Payment is declined**: `4000 0000 0000 9995`

Use any future expiry date, any 3-digit CVC, and any postal code.

### Testing Flow

1. Add items to your cart
2. Go to checkout
3. Fill in delivery address
4. Select **"🌐 Online Payment"** as payment method
5. Click **"Place Order"**
6. You'll be redirected to the Stripe payment form
7. Enter test card details
8. Complete the payment
9. You should be redirected to your order confirmation page

## Payment Status

Orders with online payment will have:
- `paymentMethod`: `'online'`
- `paymentStatus`: `'pending'` → `'paid'` (after successful payment)
- `stripePaymentIntentId`: Stripe's payment intent ID for reference

## Troubleshooting

### Common Issues

1. **"Stripe is not defined" error**
   - Make sure `REACT_APP_STRIPE_PUBLISHABLE_KEY` is set in client `.env`
   - Restart the React development server after adding environment variables

2. **"Invalid API Key" error**
   - Verify your Stripe secret key is correct in server `.env`
   - Make sure you're using the correct key for your environment (test vs. live)

3. **Webhook signature verification failed**
   - Ensure `STRIPE_WEBHOOK_SECRET` is correctly set
   - If using Stripe CLI, make sure it's running and forwarding to the correct port

4. **Payment succeeds but order status not updated**
   - Check webhook configuration
   - Verify webhook endpoint is accessible
   - Check server logs for webhook errors

## Security Notes

- **Never commit `.env` files** to version control
- Use test keys for development
- Use live keys only in production with HTTPS
- Webhook secrets should be kept secure
- Validate all payment amounts on the server side

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe React Integration](https://stripe.com/docs/stripe-js/react)

## Support

For issues related to:
- Stripe integration: Check Stripe documentation or contact Stripe support
- Application bugs: Create an issue in the project repository
