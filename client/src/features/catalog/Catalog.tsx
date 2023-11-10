import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import ProductList from "./ProductList";
import { useEffect } from "react";
import { fetchProductsAsync, productSelectors } from "./catalogSlice";




export default function Catalog() {
    // const [products,setProducts] = useState<Product[]>([]);
    //instead of getting from local state get from redux
    

    //const [loading,setLoading] = useState(true);
    const products = useAppSelector(productSelectors.selectAll);
    const {productsLoaded,status} = useAppSelector(state => state.catalog);
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

    if(status.includes('pending')) return <LoadingComponent message="Loading products"></LoadingComponent>
    return (
      <>
        <ProductList products={products}></ProductList>
      </>
    )
}