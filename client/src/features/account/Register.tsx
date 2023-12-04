
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Alert, AlertTitle, List, ListItem, ListItemText, Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useAppDispatch } from '../../app/store/configureStore';
import agent from '../../app/api/agent';
import { useEffect, useState } from 'react';


export default function Register() {
  const [validationErrors, setValidationErrors] = useState([]);  
  const {register,handleSubmit, formState: {isSubmitting,errors,isValid}} = useForm({
    mode:'onTouched'
  });


  useEffect(() => {
   
  }, [validationErrors])
  

  return (
      <Container component={Paper} maxWidth="sm" sx={{display:'flex', flexDirection:'column', alignItems:'center', p: 4}}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <Box component="form" 
          onSubmit={handleSubmit(data => agent.Account.register(data).catch(error => setValidationErrors(error.data.errors)))} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              fullWidth
              label="Username"
              autoFocus
              //replaces  onChange={handleInputChange}
              {...register('username', {required:'Username is required'})}
              //!! casts username into a boolean if it exists in error object will be true
              //will give input a red color
              error={!!errors.username}
              helperText={errors?.username?.message as string}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Email"
              //replaces  onChange={handleInputChange}
              {...register('email', {required:'Email is required'})}
              //!! casts username into a boolean if it exists in error object will be true
              //will give input a red color
              error={!!errors.email}
              helperText={errors?.email?.message as string}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Password"
              type="password"
              {...register('password', {required:'Password is required'})}
              error={!!errors.password}
              helperText={errors?.password?.message as string}
              
            />
            <LoadingButton
              loading={isSubmitting}
              disabled={!isValid}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </LoadingButton>
            <Grid container>
              <Grid item>
                <Link to='/login'>
                  {"Alrwady have an account? Sign In"}
                </Link>
              </Grid>
            </Grid>
          </Box>
      </Container>
  );
}