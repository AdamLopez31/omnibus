import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutPage from "./CheckoutPage";
import { useAppDispatch } from "../../app/store/configureStore";
import { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import { setBasket } from "../basket/basketSlice";
import LoadingComponent from "../../app/layout/LoadingComponent";


const stripePromise = loadStripe('pk_test_51OSRkoEEHw69uPa8fbMuAebGrrYjHK5bmyGvZTStrU3cI5QSIHDYQXdYBI2S2hcvK7oH8HuH6iemN7I5cqt1PTMa00jQeKz2iC')


export default function CheckoutWrapper () {
    const dispatch = useAppDispatch();
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        agent.Payments.createPaymentIntent()
        .then(basket => dispatch(setBasket(basket)))
        .catch(error => console.log(error))
        .finally(() => setLoading(false))
    },[dispatch]);

    if(loading) return <LoadingComponent message="Loading checkout ..."></LoadingComponent>
    return (
        <Elements stripe={stripePromise}>
            <CheckoutPage></CheckoutPage>
        </Elements>
    )
}