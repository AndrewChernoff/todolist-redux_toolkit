import { handleServerNetworkError } from './error-utils';
import { setStatus } from '../app/app-reducer';
import { BaseThunkAPI } from '@reduxjs/toolkit/dist/createAsyncThunk';
import { AppDispatch, AppRootStateType } from '../app/store';
import { ResponseType } from '../types/common.types';

export const thunkTryCatch = async (thunkAPI: BaseThunkAPI<AppRootStateType, any, AppDispatch, null | ResponseType>, logic: Function) => {
  const {dispatch, rejectWithValue} = thunkAPI
  dispatch(setStatus({status: 'loading'}))
  try {
    return await logic()
  } catch (e) {
    handleServerNetworkError(e, dispatch)
    return rejectWithValue(null)
  } finally {
   // в handleServerNetworkError можно удалить убирани крутилки
    dispatch(setStatus({status: 'idle'}))
  }
}
