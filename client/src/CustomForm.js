import { PaymentElement } from "@stripe/react-stripe-js";
import React from "react";

export default function CustomForm({ handleSubmit, isProcessing }) {
  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement
        options={{
          business: { name: "eCohete" },
          terms: {
            card: "always",
          },
        }}
      />
      <button disabled={isProcessing} id="submit">
        <span id="button-text">
          {isProcessing ? "Processing ... " : "Pay now"}
        </span>
      </button>
    </form>
  );
}
