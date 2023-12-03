import { Container, CssBaseline, ThemeProvider,createTheme } from "@mui/material";
import Header from "./Header";
import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import LoadingComponent from "./LoadingComponent";
import { useAppDispatch } from "../store/configureStore";
import { fetchBasketAsync } from "../../features/basket/basketSlice";
import { fetchCurrentUser } from "../../features/account/accountSlice";

function App() {

  //SETTING BASKET FOR WHOLE APP 
  //CONTEXT
  // const {setBasket} = useStoreContext();
  const dispatch = useAppDispatch();
  const [loading,setLoading] = useState(true);


  //TO AVOID INFINITE RERENDERING IN USEEFFECT USE REACT CALLBACK FUNCTION
  //WILL MEMOIZE THIS FUNCTION AND MAKE SURE IT DOES NOT CHANGE ON ANY RERENDER
  const initApp = useCallback(async () => {
      try {
        await dispatch(fetchCurrentUser());
        await dispatch(fetchBasketAsync());
  
      } catch (error:any) {
        console.log(error);
      }
    },[dispatch]
  )
  

  useEffect(() => {
    initApp().then(() => setLoading(false));
  },[initApp])

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
