import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { User } from "../../app/models/user";
import { FieldValues } from "react-hook-form";
import agent from "../../app/api/agent";
import { router } from "../../app/router/Routes";

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
            const user = await agent.Account.login(data);
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
    'account/fetchUser',
    async (_, thunkAPI) => {
        try {
            const user = await agent.Account.currentUser();
            localStorage.setItem('user',JSON.stringify(user));
            return user;
        } catch (error:any) {
            return thunkAPI.rejectWithValue({error:error.data});
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
        }
    },
    //use addMatcher because our 2 createAsyncThunk are both returning user and we 
    //want to set our user in them
    extraReducers: (builder => {
        builder.addMatcher(isAnyOf(signInUser.fulfilled, fetchCurrentUser.fulfilled), (state,action) => {
            state.user = action.payload;
        });
        builder.addMatcher(isAnyOf(signInUser.rejected, fetchCurrentUser.rejected), (_state,action) => {
            console.log(action.payload);
        }); 
    })
})

export const {signOut} = accountSlice.actions;