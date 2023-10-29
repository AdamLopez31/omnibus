
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


//SLICE
export default function counterReducer(state = initialState, action: any) {
    switch (action.type) {
        case INCREMENT_COUNTER:
            //cannot mutate state
            //return state.data + 1
            //SHOULD CREATE COPY OF STATE AND REPLACE IT
            //AVOID MUTATING STATE USE SPREAD OPERATOR
            //will return new state with updated property
            return {
                ...state,
                data: state.data + 1
            }
        case DECREMENT_COUNTER:
            return {
                ...state,
                data: state.data - 1
            }
        default:
            return state;
    }
}