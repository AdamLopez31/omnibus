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
import RequireAuth from "./RequireAuth";
import Orders from "../../features/orders/Orders";
import CheckoutWrapper from "../../features/checkout/CheckoutWrapper";
import Inventory from "../../features/admin/Inventory";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App></App>,
        children: [
            //"protected routes" <RequireAuth></RequireAuth> when we load checkout component we load require auth if we pass
            //we're sent to checkout page 
            //AUTHENTICATED ROUTES
            {element: <RequireAuth></RequireAuth>, children: [
                {path: 'checkout', element: <CheckoutWrapper></CheckoutWrapper>},
                {path: 'orders', element: <Orders></Orders>},
            ]},
            //ADMIN ROUTES
            {element: <RequireAuth roles={['Admin']}></RequireAuth>, children: [
                {path: 'inventory', element: <Inventory></Inventory>}
            ]},
            {path: '', element: <HomePage></HomePage>},
            {path: 'catalog', element: <Catalog></Catalog>},
            {path: 'catalog/:id', element: <ProductDetails></ProductDetails>},
            {path: 'about', element: <AboutPage></AboutPage>},
            {path: 'contact', element: <ContactPage></ContactPage>},
            {path: 'server-error', element: <ServerError></ServerError>},
            {path: 'not-found', element: <NotFound></NotFound>},
            {path: 'basket', element: <BasketPage></BasketPage>},
            {path: 'login', element: <Login></Login>},
            {path: 'register', element: <Register></Register>},
            // if they navigate to something that doesn't exist in our application
            {path: '*', element: <Navigate to='/not-found'></Navigate>}
        ]
    }
])