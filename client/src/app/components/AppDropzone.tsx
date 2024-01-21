
import { UploadFile } from '@mui/icons-material';
import { FormControl, FormHelperText, Typography } from '@mui/material';
import {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { UseControllerProps, useController } from 'react-hook-form'


interface Props extends UseControllerProps {}

export default function AppDropzone(props: Props) {
  const {fieldState,field} = useController({...props, defaultValue: null});
  
  const dzStyles = {
    display: 'flex',
    border: 'dashed 3px #eee',
    borderColor: '#eee',
    borderRadius: '5px',
    paddingTop:'30px',
    alignItems:'center',
    height:200,
    width:500
  }

  //IF HOVERING IMAGE OVER DROPZONE
  //overrides dzStyles borderColor cascading effect
  const dzActive = {
    borderColor: 'green'
  }
  const onDrop = useCallback((acceptedFiles:any) => {
    //Object.assign allows us to create new object from existing object .createObjectURL(acceptedFiles[0])
    acceptedFiles[0] 
    = Object.assign(acceptedFiles[0],{preview: URL.createObjectURL(acceptedFiles[0])});
    field.onChange(acceptedFiles[0]);
  }, [field])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps()}>
      <FormControl style={isDragActive ? {...dzStyles, ...dzActive} : dzStyles} error={!!fieldState.error}>
        <input  {...getInputProps()} />
        <UploadFile sx={{fontSize: '100px'}}></UploadFile>
        <Typography variant='h4'>Drop image here</Typography>
        <FormHelperText>{fieldState.error?.message}</FormHelperText>
      </FormControl>
    </div>
  )
}