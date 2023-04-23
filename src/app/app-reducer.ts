import {Dispatch} from 'redux'
import {authAPI} from '../api/todolists-api'
//import {setIsLoggedInAC} from '../features/Login/auth-reducer'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { authThunk, setIsLoggedIn } from '../features/Login/auth-reducer'
import { createAppAsyncThunk } from '../utils/createAppAsyncThunk'
import { handleServerAppError, handleServerNetworkError } from '../utils/error-utils'

const initialState: InitialStateType = {
    status: 'idle',
    error: null,
    isInitialized: false
}

/* const initializeApp = createAppAsyncThunk<any, any>(
  'initializeApp',
  // Declare the type your function argument here:
  async (__, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
      const res = await authAPI.me()
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedIn({isLoggedIn:true}))
        dispatch(setAppInitialized({value: true}))
        //return {initStatus: true}
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    } catch(error) {
      handleServerNetworkError(error, dispatch)
      return rejectWithValue(null)
    }  finally {
      dispatch(setAppInitialized({value: true}))
    }
    }

)
 */
/* export const initializeAppTC = () => (dispatch: Dispatch) => {
  authAPI.me().then(res => {
      if (res.data.resultCode === 0) {
          dispatch(setIsLoggedIn({isLoggedIn: true}));
      } else {

      }

      dispatch(setAppInitialized({value: true}));
  })
} */
  
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
    /* extraReducers: (builder) => {
       builder.addCase(authThunk.initializeApp.fulfilled, (state, action: PayloadAction<{isLoggedIn: boolean}>) => {
        state.isInitialized = action.payload.isLoggedIn
      })
    }, */
  })
  
  export const appReducer = slice.reducer
  export const {setStatus, setAppError, setAppInitialized} = slice.actions
  //export const appThunk = {initializeApp}
  

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    // происходит ли сейчас взаимодействие с сервером
    status: RequestStatusType
    // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
    error: string | null
    // true когда приложение проинициализировалось (проверили юзера, настройки получили и т.д.)
    isInitialized: boolean
}

