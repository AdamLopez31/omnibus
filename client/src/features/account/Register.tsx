
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
import { toast } from 'react-toastify';


export default function Register() {
  const navigate = useNavigate();
  const {register,handleSubmit, setError, formState: {isSubmitting,errors,isValid}} = useForm({
    mode:'onTouched'
  });

  function handleApiErrors(errors:any) {
    let errorsArray = extractApiErrors(errors.data.errors)
    console.log(errorsArray);
    if(errorsArray) {
      errorsArray.forEach((error:string) => {
        if(error.includes('Password')) {
          setError('password', {message:error})
        }
        else if(error.includes('Email')) {
          setError('email', {message:error})
        }
        else if(error.includes('Username')) {
          setError('username', {message:error})
        }
      })
    }
  }

  function extractApiErrors(errors:any) {
    let errorValues = Object.values(errors);
    let errorLength;
    let errorDescriptionArray = [];
    errorLength = errorValues.length;
    for (let index = 0; index < errorValues.length; index++) {
      if(index === 0) {
        let extractor1Staging:any = errorValues[index];
        let extractor1 = extractor1Staging[0];
        errorDescriptionArray.push(extractor1);
      }
      else if(index === 1) {
        let extractor2Staging:any = errorValues[index];
        let extractor2 = extractor2Staging[0];
        errorDescriptionArray.push(extractor2);
      }

      else if(index === 2) {
        let extractor3Staging:any = errorValues[index];
        let extractor3 = extractor3Staging[0];
        errorDescriptionArray.push(extractor3);
      }

      else if(index === 3) {
        let extractor4Staging:any = errorValues[index];
        let extractor4= extractor4Staging[0];
        errorDescriptionArray.push(extractor4);
      }
    }
    return errorDescriptionArray;
  }
  
  return (
      <Container component={Paper} maxWidth="sm" sx={{display:'flex', flexDirection:'column', alignItems:'center', p: 4}}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <Box component="form" 
          onSubmit={handleSubmit(data => agent.Account.register(data)
          .then(() => {
            toast.success('Registration successful-you can now log in');
            navigate('/login');
          }
          )
          .catch(error => handleApiErrors(error)))} noValidate sx={{ mt: 1 }}>
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
              {...register('email', 
              {required:'Email is required', 
              pattern: {
                value: /^\w+[\w-\.]*\@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/,
                message: 'Not a valid email address'
              }})}
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
              {...register('password', 
              {
                required:'Password is required',
                pattern: {
                  value: /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/,
                  message: 'password does not meet complexity requirements'
                }
              })}
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
                  {"Already have an account? Sign In"}
                </Link>
              </Grid>
            </Grid>
          </Box>
      </Container>
  );
}