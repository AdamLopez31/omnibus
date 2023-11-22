export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    pictureUrl: string;
    type?: string;
    brand: string;
    quantityInStock?: number;
}

export interface ProductParams {
    orderBy: string;
    searchTerm?: string;
    types?: string[];
    brands?: string[];
    pageNumber: number;
    pageSize: number;
}

//http://localhost:5000/api/products?pageNumber=1&pageSize=6&orderBy=name&types=Boards