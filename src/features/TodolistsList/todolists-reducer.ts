import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {RequestStatusType,/* , SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType */
setStatus} from '../../app/app-reducer'
import {handleServerNetworkError} from '../../utils/error-utils'
import { AppThunk } from '../../app/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: Array<TodolistDomainType> = []


const slice = createSlice({
    name: 'todolists',
    initialState,
    reducers: {
        removeTodolist(state, action: PayloadAction<{id: string}>) {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            if (index !== -1) state.splice(index, 1)
      },
      addTodolist(state, action: PayloadAction<{todolist: TodolistType}>) {
        state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
      },
      changeTodolistTitle(state, action: PayloadAction<{id: string, title: string}>) {
        const index = state.findIndex(todo => todo.id === action.payload.id)
        if (index !== -1) state[index].title = action.payload.title
      },
      changeTodolistFilter(state, action: PayloadAction<{id: string, filter: FilterValuesType}>) {
        const index = state.findIndex(todo => todo.id === action.payload.id)
        if (index !== -1) state[index].filter = action.payload.filter
      },
      changeTodolistEntityStatus(state, action: PayloadAction<{id: string, status: RequestStatusType}>) {
        const index = state.findIndex(todo => todo.id === action.payload.id)
        if (index !== -1) state[index].entityStatus = action.payload.status
      },
      setTodolists(state, action: PayloadAction<{todolists: TodolistType[]}>) {
        return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
      }
    },
  })


export const todolistsReducer = slice.reducer
export const {setTodolists, removeTodolist, addTodolist, changeTodolistTitle, changeTodolistFilter, changeTodolistEntityStatus} = slice.actions

// thunks
export const fetchTodolistsTC = (): AppThunk => {
    return (dispatch) => {
        dispatch(setStatus({status: 'loading'}))
        todolistsAPI.getTodolists()
            .then((res) => {
                dispatch(setTodolists({todolists: res.data}))
                dispatch(setStatus({status: 'succeeded'}))
            })
            .catch(error => {
                handleServerNetworkError(error, dispatch);
            })
    }
}
export const removeTodolistTC = (todolistId: string) => {
    return (dispatch: ThunkDispatch) => {
        //изменим глобальный статус приложения, чтобы вверху полоса побежала
        dispatch(setStatus({status: 'loading'}))
        //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
        dispatch(changeTodolistEntityStatus({id: todolistId, status: 'loading'}))
        todolistsAPI.deleteTodolist(todolistId)
            .then((res) => {
                dispatch(removeTodolist({id: todolistId}))
                //скажем глобально приложению, что асинхронная операция завершена
                dispatch(setStatus({status: 'succeeded'}))
            })
    }
}
export const addTodolistTC = (title: string) => {
    return (dispatch: ThunkDispatch) => {
        dispatch(setStatus({status: 'loading'}))
        todolistsAPI.createTodolist(title)
            .then((res) => {
                dispatch(addTodolist({todolist: res.data.data.item}))
                dispatch(setStatus({status: 'succeeded'}))
            })
    }
}
export const changeTodolistTitleTC = (id: string, title: string): AppThunk => {
    return (dispatch/* : Dispatch<ActionsType> */) => {
        todolistsAPI.updateTodolist(id, title)
            .then((res) => {
                dispatch(changeTodolistTitle({id, title}))
            })
    }
}

// types
export type AddTodolistActionType = ReturnType<typeof addTodolist>;
export type RemoveTodolistActionType = ReturnType<typeof removeTodolist>;
export type SetTodolistsActionType = ReturnType<typeof setTodolists>;
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
type ThunkDispatch = any/* Dispatch<ActionsType | SetAppStatusActionType | SetAppErrorActionType> */
