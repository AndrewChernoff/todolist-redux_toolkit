import {Dispatch} from 'redux'
import {authAPI} from '../api/todolists-api'
//import {setIsLoggedInAC} from '../features/Login/auth-reducer'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { setIsLoggedIn } from '../features/Login/auth-reducer'

const initialState: InitialStateType = {
    status: 'idle',
    error: null,
    isInitialized: false
}

interface CounterState {
    value: number
  }
  
  //const initialState = { value: 0 } as CounterState
  
  const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
      setStatus(state, action: PayloadAction<{status: RequestStatusType}>) {
        state.status = action.payload.status
      },
      setAppError(state, action: PayloadAction<{error: string | null}>) {
        state.error = action.payload.error
      },
      setAppInitialized(state, action: PayloadAction<{value: boolean}>) {
        state.isInitialized = action.payload.value
      },
    },
  })
  
  export const appReducer = slice.reducer
  export const {setStatus, setAppError, setAppInitialized}/* appActions */ = slice.actions
  

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    // происходит ли сейчас взаимодействие с сервером
    status: RequestStatusType
    // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
    error: string | null
    // true когда приложение проинициализировалось (проверили юзера, настройки получили и т.д.)
    isInitialized: boolean
}

export const initializeAppTC = () => (dispatch: Dispatch) => {
    authAPI.me().then(res => {
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedIn({isLoggedIn: true}));
        } else {

        }

        dispatch(setAppInitialized({value: true}));
    })
}

