import axios, { AxiosError, AxiosResponse } from "axios";


axios.defaults.baseURL = 'http://localhost:5000/api/';

//helper method to extract data we're interested in from body

const responseBody = (response: AxiosResponse) => response.data;

//INTERCEPTORS
//intercept request on way out from client/browser or response back from api
axios.interceptors.response.use(response => {
    return response;
}, (error: AxiosError) => {
    console.log('caught by interceptor');
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