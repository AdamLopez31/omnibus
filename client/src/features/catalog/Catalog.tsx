import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import ProductList from "./ProductList";
import { useEffect } from "react";
import { fetchProductsAsync, productSelectors,fetchFilters } from "./catalogSlice";
import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, Grid, Pagination, Paper, Radio, RadioGroup, TextField, Typography } from "@mui/material";

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
    const {productsLoaded,status,filtersLoaded, brands, types} = useAppSelector(state => state.catalog);
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
            <TextField label='Search products' variant="outlined" fullWidth></TextField>
          </Paper>
          <Paper sx={{mb: 2, p: 2}}>
            <FormControl>
              <RadioGroup>
                {sortOptions.map(({value,label}) => (
                  <FormControlLabel value={value} control={<Radio />} label={label} key={value} />
                ))}
              </RadioGroup>
            </FormControl>
          </Paper>
          <Paper sx={{mb: 2, p: 2}}>
            <FormGroup>
              {brands.map(brand => (
                <FormControlLabel control={<Checkbox/>} label={brand} key={brand} />
              ))}
            </FormGroup>
          </Paper>
          <Paper sx={{mb: 2, p: 2}}>
            <FormGroup>
              {types.map(type => (
                <FormControlLabel control={<Checkbox/>} label={type} key={type} />
              ))}
            </FormGroup>
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