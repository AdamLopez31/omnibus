import { Container, CssBaseline, ThemeProvider,createTheme } from "@mui/material";
import Header from "./Header";
import { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useStoreContext } from "../context/StoreContext";
import { getCookie } from "../util/util";
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";

function App() {

  //SETTING BASKET FOR WHOLE APP 
  const {setBasket} = useStoreContext();
  const [loading,setLoading] = useState(true);

  useEffect(() => {
    const buyerId = getCookie('buyerId');
    if(buyerId) {
      agent.Basket.get()
      .then(basket => setBasket(basket))
      .catch(error => console.log(error))
      .finally(() => setLoading(false));
    }

    else {
      setLoading(false);
    }

  },[setBasket])

  const [darkMode,setDarkMode] = useState(false);
  const paletteType = darkMode ? 'dark': 'light';
  const theme = createTheme({
    palette: {
      mode:paletteType,
      background: {
        default: paletteType === 'light' ? '#eaeaea': '#121212'
      }
    }
  })

  function handleThemeChange () {
    setDarkMode(!darkMode);
  }

  if(loading) return <LoadingComponent message="Initializing app..."></LoadingComponent>

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored"></ToastContainer>
      <CssBaseline></CssBaseline>
      <Header darkMode={darkMode} handleThemeChange={handleThemeChange}></Header>
      <Container>
        {/* <Catalog></Catalog> */}
        <Outlet></Outlet>
      </Container>
    </ThemeProvider>
  );
}

export default App;
