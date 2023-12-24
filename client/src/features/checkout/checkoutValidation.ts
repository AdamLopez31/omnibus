import * as yup from 'yup';



//AN ARRAY OF YUP OBJECTS
export const validationSchema = [
    yup.object({
        fullName: yup.string().required('Full Name is required'),
        address1: yup.string().required('Address 1 is required'),
        address2: yup.string().required(),
        city: yup.string().required(),
        state: yup.string().required(),
        zip: yup.string().required(),
        country: yup.string().required()
    }),
    //review component not validating anything
    yup.object(),
    yup.object({
        nameOnCard: yup.string().required()
    })

]  