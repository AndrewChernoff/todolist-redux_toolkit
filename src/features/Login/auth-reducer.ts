import {Dispatch} from 'redux'
//import {SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from '../../app/app-reducer'
import {authAPI, LoginParamsType, ResultCode} from '../../api/todolists-api'
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { /* appThunk ,*/ setAppInitialized, setStatus } from '../../app/app-reducer'
import { AppThunk } from '../../app/store'
import { clearData } from '../TodolistsList/todolists-reducer'
import { createAppAsyncThunk } from '../../utils/createAppAsyncThunk'
import { ResponseType } from '../../types/common.types'
import { thunkTryCatch } from '../../utils/thunk-try-catch'

type InitialStateType = {
    isLoggedIn: boolean
}


const initialState: InitialStateType = {
    isLoggedIn: false
}

/* {isLoggedIn: boolean}, LoginParamsType */
const login = createAppAsyncThunk<{isLoggedIn: boolean}, LoginParamsType>(
    'auth/logIn', async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        return thunkTryCatch(thunkAPI, async() => {
            const res = await authAPI.login(arg)
            if (res.data.resultCode === ResultCode.success) {
              dispatch(setStatus({status: 'succeeded'}))
              return {isLoggedIn: true}
          } else {
            const isShowAppError = !(res.data as ResponseType).fieldsErrors.length
            handleServerAppError(res.data, dispatch, isShowAppError);
            return rejectWithValue(res.data)
          }
        })
    }
  )


  const logout = createAppAsyncThunk<{isLoggedIn: boolean}>(
    'auth/logOut', async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            dispatch(setStatus({status: 'loading'}))
            const res = await authAPI.logout()
            if (res.data.resultCode === ResultCode.success) {
              dispatch(setStatus({status: 'succeeded'}))
              return {isLoggedIn: false}
          } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
          }
        } catch(error) {
            handleServerNetworkError(error, dispatch)
            return rejectWithValue(null)
        }
    }
  )


const initializeApp = createAppAsyncThunk<{isLoggedIn:true}, void>(
    'initializeApp',
    // Declare the type your function argument here:
    async (__, thunkAPI) => {
      const {dispatch, rejectWithValue} = thunkAPI
      try {

        const res = await authAPI.me()
        if (res.data.resultCode === 0) {
          return {isLoggedIn:true}
        } else {
          return rejectWithValue(null)
        }
      } catch(error) {
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
      } finally {
        dispatch(setAppInitialized({value: true}))
      } 
      }
  
  )
  


const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setIsLoggedIn(state, action: PayloadAction<{isLoggedIn: boolean}>) {
            state.isLoggedIn = action.payload.isLoggedIn
        }
    },
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state, action: PayloadAction<{isLoggedIn: boolean}>) => {
            state.isLoggedIn = action.payload.isLoggedIn
        })
        .addCase(logout.fulfilled, (state, action: PayloadAction<{isLoggedIn: boolean}>) => {
            state.isLoggedIn = action.payload.isLoggedIn
        })
        .addCase(initializeApp.fulfilled, (state, action: PayloadAction<{isLoggedIn: boolean}>) => {
            state.isLoggedIn = action.payload.isLoggedIn
        })
    }
})

export const authReducer = slice.reducer
export const {setIsLoggedIn} = slice.actions

export const authThunk = {login, logout, initializeApp}

// thunks

