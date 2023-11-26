import { Navigate, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import Catalog from "../../features/catalog/Catalog";
import ProductDetails from "../../features/catalog/ProductDetails";
import AboutPage from "../../features/about/AboutPage";

import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import BasketPage from "../../features/basket/BasketPage";
import CheckoutPage from "../../features/checkout/CheckoutPage";
import ContactPage from "../../features/contact/ContactPage";
import Register from "../../features/account/Register";
import Login from "../../features/account/Login";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App></App>,
        children: [
            {path: '', element: <HomePage></HomePage>},
            {path: 'catalog', element: <Catalog></Catalog>},
            {path: 'catalog/:id', element: <ProductDetails></ProductDetails>},
            {path: 'about', element: <AboutPage></AboutPage>},
            {path: 'contact', element: <ContactPage></ContactPage>},
            {path: 'server-error', element: <ServerError></ServerError>},
            {path: 'not-found', element: <NotFound></NotFound>},
            {path: 'basket', element: <BasketPage></BasketPage>},
            {path: 'checkout', element: <CheckoutPage></CheckoutPage>},
            {path: 'login', element: <Login></Login>},
            {path: 'register', element: <Register></Register>},
            // if they navigate to something that doesn't exist in our application
            {path: '*', element: <Navigate to='/not-found'></Navigate>}
        ]
    }
])