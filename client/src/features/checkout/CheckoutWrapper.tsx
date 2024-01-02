import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutPage from "./CheckoutPage";


const stripePromise = loadStripe('pk_test_51OSRkoEEHw69uPa8fbMuAebGrrYjHK5bmyGvZTStrU3cI5QSIHDYQXdYBI2S2hcvK7oH8HuH6iemN7I5cqt1PTMa00jQeKz2iC')


export default function CheckoutWrapper () {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutPage></CheckoutPage>
        </Elements>
    )
}