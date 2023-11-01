import { Button, ButtonGroup, Typography } from "@mui/material";

import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { decrement, increment } from "./counterSlice";

export default function ContactPage() {

    //const dispatch = useDispatch();
    

    // const data = useSelector((state: CounterState) => state.data);
    // const title = useSelector((state: CounterState) => state.title);

    const dispatch = useAppDispatch(); 
    const {data,title} = useAppSelector(state => state.counter);


    return (
        <>
            <Typography variant="h2">
                {title}
            </Typography>
            <Typography variant="h5">
                The data is: {data}
            </Typography>
            <ButtonGroup>
                {/* <Button onClick={() => dispatch({type: DECREMENT_COUNTER})} variant='contained' color="error">Decrement</Button> */}
                {/* <Button onClick={() => dispatch({type: INCREMENT_COUNTER})} variant='contained' color="primary">Increment</Button> */}
                <Button onClick={() => dispatch(decrement(1))} variant='contained' color="error">Decrement</Button>
                <Button onClick={() => dispatch(increment(1))} variant='contained' color="primary">Increment</Button>
                <Button onClick={() => dispatch(increment(5))} variant='contained' color="secondary">Increment by 5</Button>
            </ButtonGroup>
        </>

    )
}