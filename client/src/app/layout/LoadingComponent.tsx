import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";

interface Props {
    message?:string;
}

export default function LoadingComponent({message = 'Loading...'}: Props) {
    return (
        // BACKDROP DISABLE APPLICATION WHILST THINGS ARE LOADING
        //TAKES OVER FULL SCREEN OF APP INVISIBLE PREVENTS USER FROM CLICKING ON SOMETHING
        <Backdrop open={true} invisible>
            <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
                <CircularProgress size={100} color="secondary"></CircularProgress>
                <Typography variant="h4" sx={{justifyContent:'center', position:'fixed', top:'60%'}}>
                    {message}
                </Typography>
            </Box>
        </Backdrop>
    )
}