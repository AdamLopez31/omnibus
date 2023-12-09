import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { User } from "../../app/models/user";
import { FieldValues } from "react-hook-form";
import agent from "../../app/api/agent";
import { router } from "../../app/router/Routes";
import { toast } from "react-toastify";
import { setBasket } from "../basket/basketSlice";

interface AccountState {
    user: User | null;
}

const initialState: AccountState = {
    user: null
}


//createAsyncThunk must use extra reducers
//LOGIN
export const signInUser = createAsyncThunk<User,FieldValues>(
    //type prefix
    'account/signInUser',
    async (data, thunkAPI) => {
        try {
            const userDto = await agent.Account.login(data);
            const {basket, ...user} = userDto;
            if(basket) thunkAPI.dispatch(setBasket(basket));
            localStorage.setItem('user',JSON.stringify(user));
            return user;
        } catch (error:any) {
            return thunkAPI.rejectWithValue({error:error.data});
        }
    }
);




//FETCHING CURRENTLY LOGGED IN USER
export const fetchCurrentUser = createAsyncThunk<User>(
    //type prefix
    'account/fetchCurrentUser',
    async (_, thunkAPI) => {
        thunkAPI.dispatch(setUser(JSON.parse(localStorage.getItem('user')!)));
        try {
            const userDto = await agent.Account.currentUser();
            const {basket, ...user} = userDto;
            if(basket) thunkAPI.dispatch(setBasket(basket));
            localStorage.setItem('user',JSON.stringify(user));
            return user;
        } catch (error:any) {
            //if request fails
            return thunkAPI.rejectWithValue({error:error.data});
        }
    },
    {
        condition: () => {
            //if we don't have a token inside will not make network request if we don't have user
            if(!localStorage.getItem('user')) return false;
        }
        
    }
);

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        signOut: (state) => {
            state.user = null;
            localStorage.removeItem('user');
            //send back to homepage
            router.navigate('/');
        },
        setUser: (state,action) => {
            state.user = action.payload;
        }
    },
    //use addMatcher because our 2 createAsyncThunk are both returning user and we 
    //want to set our user in them
    extraReducers: (builder => {
        builder.addCase(fetchCurrentUser.rejected, (state => {
            //log user out if not authorized
            state.user = null;
            localStorage.removeItem('user');
            toast.error('Session expired - please login again');
            router.navigate('/');
        }));
        builder.addMatcher(isAnyOf(signInUser.fulfilled, fetchCurrentUser.fulfilled), (state,action) => {
            state.user = action.payload;
        });
        builder.addMatcher(isAnyOf(signInUser.rejected, fetchCurrentUser.rejected), (_state,action) => {
            throw action.payload;
        }); 
    })
})

export const {signOut,setUser} = accountSlice.actions;