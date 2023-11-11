import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { router } from "../router/Routes";


//asynchronous code in javascript use Promise
//sleep method returning promise using sleep to simulate delay
const sleep = () => new Promise(resolve => setTimeout(resolve,500));

axios.defaults.baseURL = 'http://localhost:5000/api/';
axios.defaults.withCredentials = true;

//helper method to extract data we're interested in from body

const responseBody = (response: AxiosResponse) => response.data;

//INTERCEPTORS cd Desktop/omnibus/client
//intercept request on way out from client/browser or response back from api
axios.interceptors.response.use(async response => {
    //with async await you don't have to use .then() keyword 
    await sleep();
    return response;
}, (error: AxiosError) => {
    console.log('caught by interceptor');
    const  {data,status} = error.response as AxiosResponse;
    switch (status) {
        case 400:
            toast.error(data.title)
            break;
        case 401:
            toast.error(data.title)
            break;
        // case 404:
        //         toast.error(data.title)
        //         break;    
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
    get: (url:string) => axios.get(url,{ headers: { "Access-Control-Allow-Credentials": "true" } }).then(responseBody),
    post: (url:string, body: object) => axios.post(url, body,{ headers: { "Access-Control-Allow-Credentials": "true" } }).then(responseBody),
    put: (url:string, body: object) => axios.put(url, body,{ headers: { "Access-Control-Allow-Credentials": "true" } }).then(responseBody),
    delete: (url:string) => axios.delete(url,{ headers: { "Access-Control-Allow-Credentials": "true" } }).then(responseBody),
}

const Catalog = {
    list: () => requests.get('products'),
    // list: () => requests.get('buggy/server-error'),
    details: (id: number) => requests.get(`products/${id}`)
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

const agent = {
    Catalog,
    TestErrors,
    Basket
}



export default agent;