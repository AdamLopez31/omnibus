//A SLICE OF OVERALL REDUX STATE

import { createSlice } from "@reduxjs/toolkit";

export interface CounterState {
    data: number;
    title: string;
}

const initialState: CounterState = {
    data:42,
    title: 'YARC(yet another redux counter with redux toolkit)'
}

export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment: (state,action) => {
            //USES IMMER LIBRARY TO MUTATE STATE FOR US
            state.data += action.payload
        },
        decrement: (state,action) => {
            //USES IMMER LIBRARY TO MUTATE STATE FOR US
            state.data -= action.payload
        }

    }
})

export const {increment,decrement} = counterSlice.actions;