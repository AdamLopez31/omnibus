import { useEffect, useState } from "react";
import { Product } from "../models/product";
import Catalog from "../../features/catalog/Catalog";
import { Container, CssBaseline, Typography } from "@mui/material";
import Header from "./Header";

function App() {
  const [products,setProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    fetch('http://localhost:5000/api/products')
    .then(response => response.json())
    .then(data => setProducts(data))
  },[]);
  

  return (
    <>
      <CssBaseline></CssBaseline>
      <Header></Header>
      <Container>
        <Catalog products={products}></Catalog>
      </Container>
    </>
  );
}

export default App;
