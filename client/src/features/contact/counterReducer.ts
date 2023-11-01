//ACTION TYPES
export const INCREMENT_COUNTER = "INCREMENT_COUNTER";
export const DECREMENT_COUNTER = " DECREMENT_COUNTER";


export interface CounterState {
    data: number;
    title: string;
}

const initialState: CounterState = {
    data:42,
    title: 'YARC(yet another redux counter)'
}


//ACTION CREATORS
export function increment(amount = 1) {
    return {
        type: INCREMENT_COUNTER,
        payload: amount
    }
}

export function decrement(amount = 1) {
    return {
        type: DECREMENT_COUNTER,
        payload: amount
    }
}

interface CounterAction {
    type: string,
    payload: number
}


//SLICE
export default function counterReducer(state = initialState, action: CounterAction) {
    switch (action.type) {
        case INCREMENT_COUNTER:
            //cannot mutate state
            //return state.data + 1
            //SHOULD CREATE COPY OF STATE AND REPLACE IT
            //AVOID MUTATING STATE USE SPREAD OPERATOR
            //will return new state with updated property
            return {
                ...state,
                data: state.data + action.payload
            }
        case DECREMENT_COUNTER:
            return {
                ...state,
                data: state.data - action.payload
            }
        default:
            return state;
    }
}