import { Typography, Grid } from "@mui/material";
import { useFormContext } from "react-hook-form";
import AppTextInput from "../../app/components/AppTextInput";
import AppCheckBox from "../../app/components/AppCheckBox";

export default function AddressForm() {
  const {control} = useFormContext();
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Shipping address
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <AppTextInput control={control} name="fullName" label="Full name"></AppTextInput>
        </Grid>
        <Grid item xs={12}>
          <AppTextInput control={control} name="address1" label="Address 1"></AppTextInput>
        </Grid>
        <Grid item xs={12}>
          <AppTextInput control={control} name="address2" label="Address 2"></AppTextInput>
        </Grid>
        <Grid item xs={12} sm={6}>
          <AppTextInput control={control} name="city" label="City"></AppTextInput>
        </Grid>
        <Grid item xs={12} sm={6}>
          <AppTextInput control={control} name="state" label="State/Province/Region"></AppTextInput>
        </Grid>
        <Grid item xs={12} sm={6}>
          <AppTextInput control={control} name="zipcode" label="Zipcode"></AppTextInput>
        </Grid>
        <Grid item xs={12} sm={6}>
          <AppTextInput control={control} name="country" label="Country"></AppTextInput>
        </Grid>
        <Grid item xs={12}>
          <AppCheckBox name="saveAddress" label="Save this as default address" control={control}></AppCheckBox>
        </Grid>
      </Grid>
    </>
  );
}