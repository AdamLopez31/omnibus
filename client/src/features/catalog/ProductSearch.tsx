import { TextField, debounce } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setProductParams } from "./catalogSlice";
import { useState } from "react";

export default function ProductSearch () {
    const {productParams} = useAppSelector(state => state.catalog);
    const [searchTerm, setSearchTerm] = useState(productParams.searchTerm);
    const dispatch = useAppDispatch();


    //DELAY DISPATCH OF ACTION debounce function from material ui: wait a period of time before we execute the action
    const debouncedSearch = debounce((event:any) => {
        //WAIT BEFORE WE UPDATE PRODUCT PARAMS AND SET OF CHAIN OF EVENTS IN CATALOG SLICE createAsyncThunk METHODS
        dispatch(setProductParams({searchTerm: event.target.value}))
    },1000)
    return (
        <TextField 
        label='Search products' 
        variant="outlined" 
        fullWidth 
        value={searchTerm || ''}
        onChange={(event:any) => {
            setSearchTerm(event.target.value);
            debouncedSearch(event);
        }}
        >

        </TextField>
    )
}