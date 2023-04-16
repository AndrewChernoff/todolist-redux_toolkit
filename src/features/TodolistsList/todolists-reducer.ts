import { ResultCode, TodolistType } from './../../api/todolists-api';
import {todolistsAPI, /* TodolistType */} from '../../api/todolists-api'
import {RequestStatusType, setStatus} from '../../app/app-reducer'
import {handleServerNetworkError} from '../../utils/error-utils'
import { AppThunk } from '../../app/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAppAsyncThunk } from '../../utils/createAppAsyncThunk';

const initialState: Array<TodolistDomainType> = []

const fetchTodolists = createAppAsyncThunk<{todolists: TodolistType[]}, any>(
    'todolists/fetchTodolists',
    async ( _: any ,thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            const res = await todolistsAPI.getTodolists()
                dispatch(setStatus({status: 'succeeded'}))
                return {todolists: res.data}

    } catch (error) {
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
      }
  )
const removeTodolist = createAppAsyncThunk<{id: string},  string>(
    'todolists/removeTodolist',
    async ( todolistId ,thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            dispatch(setStatus({status: 'loading'}))
            //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
            dispatch(changeTodolistEntityStatus({id: todolistId, status: 'loading'}))
            const res = await todolistsAPI.deleteTodolist(todolistId)
            if(res.data.resultCode === ResultCode.success) {
                    dispatch(setStatus({status: 'succeeded'}))
                    return {id: todolistId}
            } else {
                return rejectWithValue(null)
            }
        }
        catch (error) {
            handleServerNetworkError(error, dispatch)
            return rejectWithValue(null)
        }
      }
  )

  const addTodolist = createAppAsyncThunk<{todolist: TodolistType},  string>(
    'todolists/addTodolist',
    async ( title ,thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            dispatch(setStatus({status: 'loading'}))
            //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
            const res = await todolistsAPI.createTodolist(title)
            if(res.data.resultCode === ResultCode.success) {
                    dispatch(setStatus({status: 'succeeded'}))
                    return {todolist: res.data.data.item}
            } else {
                return rejectWithValue(null)
            }
        }
        catch (error) {
            handleServerNetworkError(error, dispatch)
            return rejectWithValue(null)
        }
      }
  )

  const changeTodolistTitle = createAppAsyncThunk<{id: string, title: string},  {id: string, title: string}>(
    'todolists/changeTodolistTitle',
    async ( {id, title} ,thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            dispatch(setStatus({status: 'loading'}))
            //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
            const res = await todolistsAPI.createTodolist(title)
            if(res.data.resultCode === ResultCode.success) {
                    dispatch(setStatus({status: 'succeeded'}))
                    return {id, title}
            } else {
                return rejectWithValue(null)
            }
        }
        catch (error) {
            handleServerNetworkError(error, dispatch)
            return rejectWithValue(null)
        }
      }
  )

const slice = createSlice({
    name: 'todolists',
    initialState,
    reducers: {
    changeTodolistFilter(state, action: PayloadAction<{id: string, filter: FilterValuesType}>) {
        const index = state.findIndex(todo => todo.id === action.payload.id)
        if (index !== -1) state[index].filter = action.payload.filter
      },
      changeTodolistEntityStatus(state, action: PayloadAction<{id: string, status: RequestStatusType}>) {
        const index = state.findIndex(todo => todo.id === action.payload.id)
        if (index !== -1) state[index].entityStatus = action.payload.status
      },
      clearData(state) {
       return state = []
      }
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchTodolists.fulfilled, (state, action: PayloadAction<{todolists: TodolistType[]}>) => {
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        })
        .addCase(removeTodolist.fulfilled, (state, action: PayloadAction<{id: string}>) => {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            if (index !== -1) state.splice(index, 1)
        })
        .addCase(addTodolist.fulfilled, (state, action: PayloadAction<{todolist: TodolistType}>) => {
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
        })
        .addCase(changeTodolistTitle.fulfilled, (state, action: PayloadAction<{id: string, title: string}>) => {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            if (index !== -1) state[index].title = action.payload.title        })
      },
  })


export const todolistsReducer = slice.reducer
export const { changeTodolistFilter, changeTodolistEntityStatus, clearData} = slice.actions
export const thunkTodolists = {fetchTodolists, removeTodolist, addTodolist, changeTodolistTitle}

// types
export type AddTodolistActionType = ReturnType<typeof addTodolist>;
export type RemoveTodolistActionType = ReturnType<typeof removeTodolist>;
//export type SetTodolistsActionType = ReturnType<typeof setTodolists>;
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}