import { ResponseType } from '../api/todolists-api'
import { Dispatch} from 'redux'
import { setAppError, setStatus } from '../app/app-reducer'
import { AppDispatch } from '../app/store'
import axios from 'axios'


export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: AppDispatch, isShown: boolean = true) => {
    /* if (data.messages.length) {
        dispatch(setAppError({error: data.messages[0]}))
    } else {
        dispatch(setAppError({error: 'Some error occurred'}))
    } */
    if (isShown) {
    dispatch(setAppError({error: data.messages.length? data.messages[0] : 'Some error occurred'}))
}
//dispatch(setStatus({status:'failed'}))
}

export const handleServerNetworkError = (
  error: unknown,
  dispatch: Dispatch,
  isShown=true
) => {
  if (axios.isAxiosError(error)) {
    dispatch(
      setAppError({
        error: error.message ? error.message : "Some error occurred",
      })
    );
  } else if (!isShown) {
    return//dispatch(setStatus({ status: "failed" }));
  }
  /* else {
    dispatch(setStatus({ status: "failed" }));
  } */
};
