import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import api from '@/lib/api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement) },
    });

    if (error) {
      alert(error.message);
    } else if (paymentIntent.status === 'succeeded') {
      await api.patch(`/bookings/${paymentIntent.metadata.bookingId}/confirm`);
      alert('Payment successful! Check your email for confirmation.');
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement className="border px-3 py-2 rounded" />
      <button
        disabled={!stripe || processing}
        className="w-full bg-green-600 text-white py-2 rounded disabled:bg-gray-400"
      >
        {processing ? 'Processing…' : 'Pay Now'}
      </button>
    </form>
  );
}

export default function Checkout() {
  const { bookingId } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['checkout', bookingId],
    queryFn: () => api.get(`/bookings/${bookingId}`).then((r) => r.data),
  });

  if (isLoading) return <div className="p-8">Loading booking…</div>;
  if (error) return <div className="p-8 text-red-600">Booking not found.</div>;

  const { booking, clientSecret } = data;

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>

      <div className="bg-white p-6 rounded shadow space-y-4">
        <h2 className="text-xl font-semibold">{booking.farm.name}</h2>
        <p>Activity: {booking.activity.name}</p>
        <p>Date: {booking.date}</p>
        <p>Participants: {booking.participants}</p>
        <p>Guide: {booking.guide?.name || 'None'}</p>
        <p>Driver: {booking.driver?.name || 'None'}</p>
        <p className="text-xl font-bold">Total: LKR {booking.totalCost}</p>

        <Elements stripe={stripePromise}>
          <CheckoutForm clientSecret={clientSecret} />
        </Elements>
      </div>
    </div>
  );
}