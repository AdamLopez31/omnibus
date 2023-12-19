import { TextField } from "@mui/material";
import { UseControllerProps, useController } from "react-hook-form";

interface Props extends UseControllerProps {
    label: string;
}

export default function AppTextInput(props: Props) {
    const {fieldState,field} = useController({...props, defaultValue: ''})
    return (
        <TextField {...props} {...field} fullWidth variant="outlined" error={!!fieldState.error} helperText={fieldState.error?.message}>
            {/* !!fieldState.error !! casting to boolean */}
            {/* field onChange event name of text field onBlur event and its value */}
        </TextField>
    )
}