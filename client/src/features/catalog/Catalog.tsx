import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import ProductList from "./ProductList";
import { useEffect } from "react";
import { fetchProductsAsync, productSelectors,fetchFilters, setProductParams } from "./catalogSlice";
import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, Grid, Pagination, Paper,Typography } from "@mui/material";
import ProductSearch from "./ProductSearch";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";
import CheckboxButtons from "../../app/components/CheckboxButtons";

const sortOptions = [
  {value: 'name', label: 'Alphabetical'},
  {value: 'priceDesc', label: 'Price - High to low'},
  {value: 'price', label: 'Price - Low to high'}
]


export default function Catalog() {
    // const [products,setProducts] = useState<Product[]>([]);
    //instead of getting from local state get from redux
    

    //const [loading,setLoading] = useState(true);
    const products = useAppSelector(productSelectors.selectAll);
    const {productsLoaded,status,filtersLoaded, brands, types, productParams} = useAppSelector(state => state.catalog);
    const dispatch = useAppDispatch();
    
    useEffect(() => {
      // fetch('http://localhost:5000/api/products')
      // .then(response => response.json())
      // .then(data => setProducts(data))
      // agent.Catalog.list().then(products => setProducts(products))
      // .catch(error => console.log(error))
      // .finally(() => setLoading(false));
      //we don't lose our redux state when we stay within our app
      //when we load different component using local state that state is destroyed
      if(!productsLoaded) dispatch(fetchProductsAsync());
    },[productsLoaded,dispatch]);

    useEffect(() => {
      if(!filtersLoaded) dispatch(fetchFilters());
    },[dispatch,filtersLoaded])

    if(status.includes('pending')) return <LoadingComponent message="Loading products"></LoadingComponent>
    return (
      <Grid container spacing={4}>
        <Grid item xs={3}>
          <Paper sx={{mb: 2}}>
            <ProductSearch></ProductSearch>
          </Paper>
          <Paper sx={{mb: 2, p: 2}}>
            {/* MAKE RadioButtonGroup SELF CLOSING TO AVOID TYPESCRICT ERROR !!!!!! */}
            <RadioButtonGroup 
            selectedValue={productParams.orderBy} 
            options={sortOptions} 
            onChange={(e) => dispatch(setProductParams({orderBy: e.target.value}))}/>
          </Paper>
          <Paper sx={{mb: 2, p: 2}}>
            <CheckboxButtons 
            items={brands} 
            checked={productParams.brands} 
            onChange={(items:string[]) => dispatch(setProductParams({brands: items}))}
            />
          </Paper>
          <Paper sx={{mb: 2, p: 2}}>
          <CheckboxButtons 
            items={types} 
            checked={productParams.types} 
            onChange={(items:string[]) => dispatch(setProductParams({types: items}))}
            />
          </Paper>
        </Grid>
        <Grid item xs={9}>
          <ProductList products={products}></ProductList>
        </Grid>
        <Grid item xs={3}></Grid>
        <Grid item xs={9}>
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography>Displaying 1-6 of 20 items  </Typography>
            <Pagination count={10} color="secondary" size="large" page={2}/>
          </Box>
        </Grid>
      </Grid>
    )
}