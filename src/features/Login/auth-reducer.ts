import {Dispatch} from 'redux'
//import {SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from '../../app/app-reducer'
import {authAPI, LoginParamsType} from '../../api/todolists-api'
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { setStatus } from '../../app/app-reducer'
import { AppThunk } from '../../app/store'
import { clearData } from '../TodolistsList/todolists-reducer'

type InitialStateType = {
    isLoggedIn: boolean
}


const initialState: InitialStateType = {
    isLoggedIn: false
}

const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setIsLoggedIn(state, action: PayloadAction<{isLoggedIn: boolean}>) {
            state.isLoggedIn = action.payload.isLoggedIn
        }
    }
})

export const authReducer = slice.reducer
export const {setIsLoggedIn} = slice.actions

// thunks
export const loginTC = (data: LoginParamsType) => (dispatch: Dispatch/* : Dispatch<ActionsType | SetAppStatusActionType | SetAppErrorActionType> */) => {
    dispatch(setStatus({status: 'loading'}))
    authAPI.login(data)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedIn({isLoggedIn:true}))
                dispatch(setStatus({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
export const logoutTC = () => (dispatch: Dispatch/* : Dispatch<ActionsType | SetAppStatusActionType | SetAppErrorActionType> */) => {
    dispatch(setStatus({status: 'loading'}))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(clearData())
                dispatch(setIsLoggedIn({isLoggedIn:false}))
                dispatch(setStatus({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
