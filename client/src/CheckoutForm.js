import { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";
import { PaymentElement } from "@stripe/react-stripe-js";
import CustomForm from "./CustomForm";

// This is a container
export default function CheckoutForm({children, clientSecret}) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/completion`,
      },
      redirect: "if_required",
    });

    if (error) {
      console.log(error);
      setMessage(error.message);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      console.log("paymentIntent: ", paymentIntent);
      setMessage("Payment status: " + paymentIntent.status + " 🥵");
    }
    setIsProcessing(false);
  };

  return (
    <>
      {children({
        handleSubmit,
        isProcessing,
      })}
    </>
  );
}
