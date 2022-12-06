import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";

function Payment() {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    fetch("/config").then(async (r) => {
      const { publishableKey } = await r.json();
      console.log(publishableKey);
      setStripePromise(loadStripe(publishableKey));
    });
  }, []);
  useEffect(() => {
    fetch("/create-payment-intent", {
      method: "POST",
      body: JSON.stringify({}),
    }).then(async (res) => {
      const { clientSecret } = await res.json();
      console.log(clientSecret);
      setClientSecret(clientSecret);
    });
  }, []);

  return (
    <div>
      <h1>React Stripe and the Payment Element</h1>
      {stripePromise && clientSecret && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: "flat",
              labels: "floating",
            },
            customerOptions: {
              customer: "cus_MtOPf09jSFZzt5",
            },
            loader: "always",
          }}
        >
          <CheckoutForm clientSecret={clientSecret} />
        </Elements>
      )}
    </div>
  );
}

export default Payment;
