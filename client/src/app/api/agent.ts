import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { router } from "../router/Routes";
import { PaginatedResponse } from "../models/pagination";
import { store } from "../store/configureStore";



//asynchronous code in javascript use Promise
//sleep method returning promise using sleep to simulate delay
const sleep = () => new Promise(resolve => setTimeout(resolve,500));

axios.defaults.baseURL = 'http://localhost:5000/api/';
axios.defaults.withCredentials = true;

//helper method to extract data we're interested in from body

const responseBody = (response: AxiosResponse) => response.data;

//INTERCEPTORS 
//intercept request on way out from client/browser or response back from api

axios.interceptors.request.use(config => {
    //ATTACH TOKEN AS AUTHORIZATION HEADER TO OUR REQUEST
    const token = store.getState().account.user?.token;
    if(token) config.headers.Authorization = `Bearer ${token}`;
    return config;
})



axios.interceptors.response.use(async response => {
    //with async await you don't have to use .then() keyword 
    await sleep();
    //axios only works with lowercase properties
    const pagination = response.headers['pagination'];
    if(pagination) {
        //override what's in response data will contain items and metadata
        response.data = new PaginatedResponse(response.data, JSON.parse(pagination));
        return response;
    }
    return response;
}, (error: AxiosError) => {
    console.log('caught by interceptor');
    const  {data,status} = error.response as AxiosResponse;
    switch (status) {
        case 400:
            if(data.errors) {
                const modelStateErrors: string[] = [];
                for(const key in data.errors) {
                    if(data.errors[key]) {
                        modelStateErrors.push(data.errors[key])
                    }
                }
                throw modelStateErrors.flat();//Create a new array with the sub-array elements concatenated
            }
            toast.error(data.title)
            break;
        case 401:
            toast.error(data.title)
            break;
        case 404:
                toast.error(data.title)
                break;    
        case 500:
            //because we are not inside of react component we have to use navigate
            //passing error data to router state
            router.navigate('/server-error',{state: {error:data}})
            break;        
    
        default:
            break;
    }
    //return error back from axios interceptor interceptors are not able to catch and handle the errors
    return Promise.reject(error.response);
})

//MUY IMPORTANTE ,{ headers: { "Access-Control-Allow-Credentials": "true" } }!!!!!!

const requests = {
    get: (url:string, params?: URLSearchParams) => axios.get(url,{ headers: { "Access-Control-Allow-Credentials": "true" },params}).then(responseBody),
    post: (url:string, body: object) => axios.post(url, body,{ headers: { "Access-Control-Allow-Credentials": "true" }}).then(responseBody),
    put: (url:string, body: object) => axios.put(url, body,{ headers: { "Access-Control-Allow-Credentials": "true" } }).then(responseBody),
    delete: (url:string) => axios.delete(url,{ headers: { "Access-Control-Allow-Credentials": "true" } }).then(responseBody),
}

const Catalog = {
    list: (params: URLSearchParams) => requests.get('products',params),
    // list: () => requests.get('buggy/server-error'),
    details: (id: number) => requests.get(`products/${id}`),
    fetchFilters: () => requests.get('products/filters')
}

const TestErrors = {
    get400Error: () => requests.get('buggy/bad-request'),
    get401Error: () => requests.get('buggy/unauthorized'),
    get404Error: () => requests.get('buggy/not-found'),
    get500Error: () => requests.get('buggy/server-error'),
    getValidationError: () => requests.get('buggy/validation-error')
}

//COOKIES WILL BE SENT AUTOMATICALLY
const Basket = {
    get: () => requests.get('basket'),
    addItem: (productId:number,quantity = 1) => requests.post(`basket?productId=${productId}&quantity=${quantity}`,{}),
    removeItem: (productId:number,quantity = 1) => requests.delete(`basket?productId=${productId}&quantity=${quantity}`),
}

const Account = {
    login: (values:any) => requests.post('account/login', values),
    register: (values:any) => requests.post('account/register', values),
    //no paramters will send token to get user back
    currentUser: () => requests.get('account/currentUser'),
    fetchAddress: () => requests.get('account/savedAddress')
}

const Orders = {
    list: () => requests.get('orders'),
    fetch: (id: number) => requests.get(`orders/${id}`),
    create: (values: any) => requests.post('orders', values)
}

const Payments = {
    createPaymentIntent: () => requests.post('payments',{})
}

const agent = {
    Catalog,
    TestErrors,
    Basket,
    Account,
    Orders,
    Payments
}



export default agent;