import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Product, ProductParams } from "../../app/models/product";
import agent from "../../app/api/agent";
import { RootState } from "../../app/store/configureStore";
import { MetaData } from "../../app/models/pagination";


interface CatalogState {
    productsLoaded: boolean;
    filtersLoaded: boolean;
    status: string;
    brands: string[];
    types: string[];
    productParams: ProductParams;
    metaData: MetaData | null;
}

const productsAdapter = createEntityAdapter<Product>();



function getAxiosParams(productParams: ProductParams) {
    const params = new URLSearchParams();
    params.append('pageNumber',productParams.pageNumber.toString());
    params.append('pageSize',productParams.pageSize.toString());
    params.append('orderBy',productParams.orderBy.toString());

    //OPTIONAL PARAMETERS
    if(productParams.searchTerm) params.append('searchTerm',productParams.searchTerm.toString());
    //TO AVOID EMPTY QUERY STRING WHEN BRAND TYPE FILTER IS UNCHECKED
    if(productParams.brands.length > 0) params.append('brands',productParams.brands.toString());
    //TO AVOID EMPTY QUERY STRING WHEN BRAND TYPE FILTER IS UNCHECKED
    if(productParams.types.length > 0) params.append('types',productParams.types.toString());

    return params;
}

//REQUESTS TO API fetchProductsAsync fetchProductAsync !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

                                            //createAsyncThunk<Product[],void>
                                            //NOT PASSING ANY ARGUMENTS TO ASYNC METHOD SO SECOND PARAMETER IS VOID
                                            //THIRD PARAMETER IS TYPE OF STATE WER'E USING
export const fetchProductsAsync = createAsyncThunk<Product[],void,{state:RootState}>(
    'catalog/fetchProductsAsync',
    //thunkAPI is second parameter so put _ as pseudo first parameter equivalent to void
    //thunkAPI to catch any errors 
    async (_,thunkAPI) => {
        const params = getAxiosParams(thunkAPI.getState().catalog.productParams);
        try {
            const response =  await agent.Catalog.list(params); 
            //set metaData
            thunkAPI.dispatch(setMetaData(response.metaData));
            return response.items;
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
        orderBy: 'name',
        //TO AVOID EMPTY QUERY STRING WHEN BRAND TYPE FILTER IS UNCHECKED
        brands: [],
        types: []
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
        productParams: initParams(),
        metaData: null
    }),
    reducers: {
        setProductParams: (state,action) => {
            state.productsLoaded = false;
            //WHEN WE SET OUR PRODUCT PARAMS WERE GOING TO PASS OUR ACTION PAYLOAD
            // SEARCH TERM AND OVERWRITE ...state.productParams
            state.productParams = {...state.productParams, ...action.payload, pageNumber: 1}
        },
        setPageNumber: (state,action) => {
            state.productsLoaded = false;
            state.productParams = {...state.productParams, ...action.payload}    
        },
        setMetaData: (state, action) => {
            state.metaData = action.payload;
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

export const {setProductParams,resetProductParams, setMetaData,setPageNumber} = catalogSlice.actions;  