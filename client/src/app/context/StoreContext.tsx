//COMPONENT WE CAN WRAP AROUND OUR APPLICATION AND HAVE THIS STATE AVAILABLE FROM ANYWHERE IN APP


import { PropsWithChildren, createContext, useContext, useState } from "react";
import { Basket } from "../models/basket";

//OUR APP
interface StoreContextValue {
    basket: Basket | null;
    //METHOD SIGNATURE
    setBasket: (basket: Basket) => void;
    removeItem: (productId:number,quantity:number) => void;
}

//<> type parameter
export const StoreContext = createContext<StoreContextValue | undefined>(undefined);

//CUSTOM REACT HOOK ALWAYS STARTS WITH USE
export function useStoreContext() {
    const context = useContext(StoreContext);
    //IF OUTSIDE THE WRAPPED CONTEXT SHOULD BE IMPOSSIBLE
    if(context === undefined) {
        throw Error('outside of provider')
    }

    return context;
}

//SIMILAR TO MATERIAL UI THEMEPROVIDER
export function StoreProvider({children}: PropsWithChildren<any>) {
    const [basket,setBasket] = useState<Basket | null>(null);

    function removeItem(productId:number,quantity:number) {
        if(!basket) return;

        //SPREAD OPERATOR CREATES COPY OF ARRAY AND STORES IT
        //DO NOT MUTATE STATE CREATE COPY OF STATE AND REPLACE
        const items = [...basket.items];

        //findIndex will return -1 if not found
        const itemIndex = items.findIndex(i => i.productId === productId);

        if(itemIndex >= 0) {
            items[itemIndex].quantity -= quantity;
            if(items[itemIndex].quantity === 0) items.splice(itemIndex,1);
            setBasket(prevState => {
                return {...prevState!, items}
            })
        }
    }

    return (
        <StoreContext.Provider value={{basket,setBasket,removeItem}}> 
            {children}
        </StoreContext.Provider>
    )
}