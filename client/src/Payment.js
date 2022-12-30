import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import CustomForm from "./CustomForm";

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
            // appearance: {
            //   theme: "flat",
            //   labels: "floating",
            // },
          }}
        >
          <CheckoutForm clientSecret={clientSecret}>
            {({ handleSubmit, isProcessing }) => {
              return (
                <CustomForm
                  handleSubmit={handleSubmit}
                  isProcessing={isProcessing}
                />
              );
            }}
          </CheckoutForm>
        </Elements>
      )}
    </div>
  );
}

export default Payment;
