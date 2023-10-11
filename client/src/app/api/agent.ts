import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { router } from "../router/Routes";


axios.defaults.baseURL = 'http://localhost:5000/api/';

//helper method to extract data we're interested in from body

const responseBody = (response: AxiosResponse) => response.data;

//INTERCEPTORS cd Desktop/omnibus/client
//intercept request on way out from client/browser or response back from api
axios.interceptors.response.use(response => {
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



const requests = {
    get: (url:string) => axios.get(url).then(responseBody),
    post: (url:string, body: {}) => axios.get(url, body).then(responseBody),
    put: (url:string, body: {}) => axios.get(url, body).then(responseBody),
    delete: (url:string) => axios.get(url).then(responseBody),
}

const Catalog = {
    list: () => requests.get('products'),
    details: (id: number) => requests.get(`products/${id}`)
}

const TestErrors = {
    get400Error: () => requests.get('buggy/bad-request'),
    get401Error: () => requests.get('buggy/unauthorized'),
    get404Error: () => requests.get('buggy/not-found'),
    get500Error: () => requests.get('buggy/server-error'),
    getValidationError: () => requests.get('buggy/validation-error')
}

const agent = {
    Catalog,
    TestErrors
}



export default agent;