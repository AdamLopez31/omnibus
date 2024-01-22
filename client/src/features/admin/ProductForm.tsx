import { Typography, Grid, Paper, Box, Button } from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import AppTextInput from "../../app/components/AppTextInput";
import { Product } from "../../app/models/product";
import { useEffect } from "react";
import useProducts from "../../app/hooks/useProducts";
import AppSelectList from "../../app/components/AppSelectList";
import AppDropzone from "../../app/components/AppDropzone";
import {yupResolver} from '@hookform/resolvers/yup';
import { validationSchema } from "./productValidation";
import agent from "../../app/api/agent";
import { useAppDispatch } from "../../app/store/configureStore";
import { setProduct } from "../catalog/catalogSlice";
import { LoadingButton } from "@mui/lab";

interface Props {
    product?: Product;
    cancelEdit: () => void;
}

export default function ProductForm({ product, cancelEdit }: Props) {
    //RESET FUNCTION IS FROM useForm watch: watch a particular field in our form
    const { control, reset, handleSubmit, watch, formState: {isDirty,isSubmitting} } = useForm({
        resolver: yupResolver<any>(validationSchema)
    });

    const { brands, types } = useProducts();

    //WE WANT TO REMOVE PREVIEW WHEN OUR COMPONENT DISMOUNTS
    const watchFile = watch('file', null);

    const dispatch = useAppDispatch();

    useEffect(() => {
        //IF WE HAVE PRODUCT RESET TO WHATEVER THE PRODUCT IS ONLY RESET THE PRODUCT IF FORM IS NOT DIRTY AND WE DON'T HAVE
        //THE WATCH FILE
        if (product && !watchFile && !isDirty) reset(product);
        //ANYTHING THAT HAPPENS WITHIN RETURN FUNCTION IS GOING TO HAPPEN WHEN OUR COMPONENT IS DESTROYED
        return() => {
            //if watchfile is not equal to null
            if(watchFile) URL.revokeObjectURL(watchFile.preview);

        }
    }, [product, reset, watchFile, isDirty]);

    async function handleSubmitData(data: FieldValues) {
        try {
            let response: Product;
            //EDIT
            if(product) {
                response = await agent.Admin.updateProduct(data);
            }
            //CREATE NEW PRODUCT
            else {
                response = await agent.Admin.createProduct(data);
            }
            dispatch(setProduct(response));
            //TO LEAVE FORM
            cancelEdit();
        } catch (error) {
            console.log(error);
        }

    }
    return (
        <Box component={Paper} sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                Product Details
            </Typography>
            <form onSubmit={handleSubmit(handleSubmitData)}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12}>
                        <AppTextInput control={control} name='name' label='Product name' />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <AppSelectList items={brands} control={control} name='brand' label='Brand' />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <AppSelectList items={types} control={control} name='type' label='Type' />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <AppTextInput type='number' control={control} name='price' label='Price' />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <AppTextInput type='number' control={control} name='quantityInStock' label='Quantity in Stock' />
                    </Grid>
                    <Grid item xs={12}>
                        <AppTextInput multiline={true} rows={4} control={control} name='description' label='Description' />
                    </Grid>
                    <Grid item xs={12}>
                        <Box display='flex' justifyContent='space-between' alignItems='center'>
                            <AppDropzone control={control} name='file' />
                            {/* IF WATCH FILE IS NOT EQUAL TO NULL SHOW IMAGE PREVIEW */}
                            {watchFile ? (
                                <img src={watchFile.preview} alt="preview" style={{maxHeight:200}}/>
                            ): (
                                <img src={product?.pictureUrl} alt={product?.name} style={{maxHeight:200}}/>
                            )}
                        </Box>
                    </Grid>
                </Grid>
                <Box display='flex' justifyContent='space-between' sx={{ mt: 3 }}>
                    <Button onClick={cancelEdit} variant='contained' color='inherit'>Cancel</Button>
                    <LoadingButton loading={isSubmitting} type="submit" variant='contained' color='success'>Submit</LoadingButton>
                </Box>
            </form>
        </Box>
    )
}