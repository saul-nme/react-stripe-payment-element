import { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  CardElement,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { PaymentElement } from "@stripe/react-stripe-js";

export default function CheckoutForm({ clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!stripe || !elements) {
        return;
      }

      setIsProcessing(true);

      const response = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/completion`,
          payment_method_data: {
            billing_details: {
              email: "amrs1399@gmail.com",
              name: "Saúl Narvaez Menencio",
            },
          },
          receipt_email: "amrs1399@gmai.com",
        },
        redirect: "if_required",
      });
      console.log(response);
      const { error, paymentIntent } = response;

      if (error) {
        console.log(error.message);
        setMessage(error.message);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        setMessage(
          "Payment status: " +
            paymentIntent.status +
            " 🥵, paymentMethod" +
            paymentIntent.payment_method
        );
      }
      setIsProcessing(false);
    } catch (error) {
      setIsProcessing(false);
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement />

      <button disabled={isProcessing} id="submit">
        <span id="button-text">
          {isProcessing ? "Processing ... " : "Pay now"}
        </span>
      </button>

      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
