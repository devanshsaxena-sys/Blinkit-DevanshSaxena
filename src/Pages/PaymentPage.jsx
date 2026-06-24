import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdLockOutline, MdPayment } from 'react-icons/md';
import axios from 'axios';
import useCart from '../hooks/useCart';
import API_URL from '../Api';
import { loadRazorpayScript } from '../utils/razorpay';

export default function PaymentPage() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();

  const cartItems = Object.values(cart);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = cartItems.reduce(
    (sum, item) => sum + item.amount * item.quantity,
    0
  ) + 25;

  const handlePayment = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    try {
      const customer = JSON.parse(localStorage.getItem('customer'));
      if (!customer) {
        toast.error('Please login first');
        navigate('/login');
        return;
      }

      setIsSubmitting(true);

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Razorpay checkout load nahi hua');
        setIsSubmitting(false);
        return;
      }

      const orderResponse = await axios.post(`${API_URL}/payments/razorpay-order`, {
        amount: total,
      });

      const razorpayOrder = orderResponse.data;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || 'INR',
        name: 'BlinkIt',
        description: 'Your grocery order payment',
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            await axios.post(`${API_URL}/payments/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: total,
            });

            for (const item of cartItems) {
              await axios.post(`${API_URL}/orders`, {
                customerId: customer.id,
                productId: item.id,
                quantity: item.quantity,
              });
            }

            clearCart();
            toast.success('Payment Successful!');
            navigate('/order-success', { replace: true });
          } catch (verifyError) {
            console.error('Payment verification failed', verifyError);
            toast.error('Payment verify nahi hua. Please contact support.');
          } finally {
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: customer.name || '',
          email: customer.email || '',
        },
        theme: {
          color: '#16a34a',
        },
      };

      const paymentObj = new window.Razorpay(options);
      paymentObj.open();
    } catch (error) {
      console.error('FULL ERROR:', error);
      if (error.response) {
        toast.error(error.response.data.message || 'Order Failed');
      } else if (error.request) {
        toast.error('Server not responding');
      } else {
        toast.error(error.message);
      }
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-md bg-white p-6 shadow-sm">

        <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
          <MdLockOutline className="text-xl text-green-600" />
          <h1 className="text-2xl font-bold text-gray-950">
            Secure Payment
          </h1>
        </div>

        <form
          className="mt-6 grid gap-4"
          onSubmit={handlePayment}
        >

          <div className="rounded-md border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-800">
            Payable amount: Rs. {total}
          </div>

          <input
            className="rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            placeholder="Card number"
            required
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <input
              className="rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              placeholder="MM / YY"
              required
            />

            <input
              className="rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              placeholder="CVV"
              required
            />
          </div>

          <button
            className="mt-2 flex items-center justify-center gap-2 rounded-md bg-green-600 px-5 py-3 font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            type="submit"
            disabled={isSubmitting}
          >
            <MdPayment /> {isSubmitting ? 'Processing...' : 'Pay Now'}
          </button>

        </form>
      </div>
    </section>
  );
}