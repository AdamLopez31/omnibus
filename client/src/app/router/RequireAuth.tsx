import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/configureStore";
import { toast } from "react-toastify";


interface Props {
    roles?: string[];
}

export default function RequireAuth({roles} : Props) {
    const {user} = useAppSelector(state => state.account);
    const location = useLocation();

    //IF WE DON'T HAVE THE USER
    if(!user) {
        return <Navigate to='/login' state={{from: location}}></Navigate>
    }

    //THIS PARTICULAR USER DOES NOT HAVE INSIDE THEIR ROLES ONE OF THE ROLES THAT WE'RE LOOKING FOR
    //THAT WE PASS TO COMPONENT WERE NOT GOING TO GIVE THEM PERMISSION TO PROCEED
    if(roles && !roles.some(r => user.roles?.includes(r))) {
        toast.error('Not authorized to access this area');
        return <Navigate to='/catalog'></Navigate>
    }

    return <Outlet></Outlet>
}