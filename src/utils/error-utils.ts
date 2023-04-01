import {ResponseType} from '../api/todolists-api'
import {Dispatch} from 'redux'
import { setAppError, setStatus } from '../app/app-reducer'

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: any/* Dispatch<SetAppErrorActionType | SetAppStatusActionType> */) => {
    if (data.messages.length) {
        dispatch(/* setAppErrorAC */setAppError({error: data.messages[0]}))
    } else {
        dispatch(setAppError({error: 'Some error occurred'}))
    }
    dispatch(setStatus({status:'failed'}))
}

export const handleServerNetworkError = (error: { message: string }, dispatch: any/* Dispatch<SetAppErrorActionType | SetAppStatusActionType> */) => {
    dispatch(setAppError({ error: error.message ? error.message : 'Some error occurred'}))
    dispatch(setStatus({status:'failed'}))
}
