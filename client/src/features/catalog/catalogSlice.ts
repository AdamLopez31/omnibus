import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Product, ProductParams } from "../../app/models/product";
import agent from "../../app/api/agent";
import { RootState } from "../../app/store/configureStore";


interface CatalogState {
    productsLoaded: boolean;
    filtersLoaded: boolean;
    status: string;
    brands: string[];
    types: string[];
    productParams: ProductParams;
}

const productsAdapter = createEntityAdapter<Product>();

export const fetchProductsAsync = createAsyncThunk<Product[]>(
    'catalog/fetchProductsAsync',
    //thunkAPI is second parameter so put _ as pseudo first parameter equivalent to void
    //thunkAPI to catch any errors 
    async (_,thunkAPI) => {
        try {
            return await agent.Catalog.list();
        } catch (error:any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)


//think of these as an outer function
//in error handling outer function thinks the request has been fulfilled
export const fetchProductAsync = createAsyncThunk<Product, number>(
    'catalog/fetchProductAsync',
    //inner function
    async (productId,thunkAPI) => {
        try {
            return await agent.Catalog.details(productId);
        } catch (error:any) {
            //rejectWithValue whole function will be rejected not fulfilled
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

//ASYNC THUNK TO GO OUT AND GET THE FILTERS
export const fetchFilters = createAsyncThunk(
    'catalog/fetchFiltersAsync',
    async (_,thunkAPI) => {
        try {
            return agent.Catalog.fetchFilters();
        } catch (error:any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)


function initParams() {
    return {
        pageNumber: 1,
        pageSize: 6,
        orderBy: 'name'
    }
}

export const catalogSlice = createSlice({
    name: 'catalog',
    //WE GET FROM PRODUCTS ADAPTER
    initialState: productsAdapter.getInitialState<CatalogState>({
        productsLoaded: false,
        filtersLoaded: false,
        status: 'idle',
        brands: [],
        types: [],
        productParams: initParams()
    }),
    reducers: {
        setProductParams: (state,action) => {
            state.productsLoaded = false;
            state.productParams = {...state.productParams, ...action.payload}
        },
        resetProductParams: (state) => {
            state.productParams = initParams();
        }
    },
    //EXTRA REDUCERS SO WE CAN DO SOMETHING WITH THE PRODUCTS WHEN WE GET THEM BACK
    extraReducers: (builder => {
        builder.addCase(fetchProductsAsync.pending, (state) => {
            state.status = 'pendingFetchProducts';
        });
        builder.addCase(fetchProductsAsync.fulfilled, (state,action) => {
            //set all products when we receive it back from api
            productsAdapter.setAll(state,action.payload);
            state.status = 'idle';
            state.productsLoaded = true;
        });

        builder.addCase(fetchProductsAsync.rejected, (state,action) => {
            console.log(action.payload)
            state.status = 'idle';
        });

        builder.addCase(fetchProductAsync.pending, (state) => {
            state.status = 'pendingFetchProduct';
        });
        builder.addCase(fetchProductAsync.fulfilled, (state,action) => {
            //UPSERT A NEW PRODUCT INTO OUR PRODUCT ENTITIES WERE STORING INSIDE OUR STATE
            productsAdapter.upsertOne(state,action.payload);
            state.status = 'idle';
        });
        builder.addCase(fetchProductAsync.rejected, (state,action) => {
            console.log(action);
            state.status = 'idle';
        });
        builder.addCase(fetchFilters.pending, (state) => {
            state.status = 'pendingFetchFilters';
        });
        //action were going to get the result of our async method in the payload
        builder.addCase(fetchFilters.fulfilled, (state,action) => {
            state.brands = action.payload.brands;
            state.types = action.payload.types;
            state.status = 'idle';
            state.filtersLoaded = true;
        });
        builder.addCase(fetchFilters.rejected, (state,action) => {
            console.log(action.payload);
            state.status = 'idle';
        });
    })

})

export const productSelectors = productsAdapter.getSelectors((state: RootState) => state.catalog);

export const {setProductParams,resetProductParams} = catalogSlice.actions;