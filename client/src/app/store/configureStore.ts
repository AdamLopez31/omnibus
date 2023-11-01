import { configureStore } from "@reduxjs/toolkit";
import { counterSlice } from "../../features/contact/counterSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";


//without redux toolkit
// export function configureStore() {
//     return createStore(counterReducer)
// }

export const store = configureStore({
    reducer: {
        counter: counterSlice.reducer
    }
});


//TYPE VARIABLE MAKE EASIER TO USE IN TYPESCRIPT
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch  = typeof store.dispatch;

//CUSTOM HOOKS ...USE IS THE CONVENTION
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;