/**
 * Use the CSS tab above to style your Element's container.
 */
import React from "react";
import {CardCvcElement, CardExpiryElement, CardNumberElement} from "@stripe/react-stripe-js";
import Grid from "@material-ui/core/Grid";

// import "./CardSectionStyles.css";

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            color: "black",
            fontWeight: 500,
            fontFamily: "Source Code Pro, Consolas, Menlo, monospace",
            fontSize: "16px",
            fontSmoothing: "antialiased",

            "::placeholder": {
                color: "#CFD7DF",
            },
            ":-webkit-autofill": {
                color: "#e39f48",
            },
        },
        invalid: {
            color: "#E25950",

            "::placeholder": {
                color: "#FFCCA5",
            },
        },
    },
};

export default function CardSection() {
    return (
        // <div>

        // <CardElement id="contained-button-file" options={CARD_ELEMENT_OPTIONS} />

        <Grid container spacing={2}>
            <Grid item xs={12}>
                <CardNumberElement options={CARD_ELEMENT_OPTIONS}></CardNumberElement>
            </Grid>
            <Grid item xs={12} sm={6}>
                <CardExpiryElement options={CARD_ELEMENT_OPTIONS}></CardExpiryElement>
            </Grid>
            <Grid item xs={12} sm={6}>
                <CardCvcElement options={CARD_ELEMENT_OPTIONS}></CardCvcElement>
            </Grid>
        </Grid>
        // </div>
    );
}
