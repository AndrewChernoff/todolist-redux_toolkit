import React, { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { AppRootStateType } from '../../app/store'
import {
	changeTodolistFilter,
    thunkTodolists,
	FilterValuesType,
	TodolistDomainType
} from './todolists-reducer'
import { TasksStateType, taskThunks } from './tasks-reducer'
import { TaskStatuses } from '../../api/todolists-api'
import { Grid, Paper } from '@mui/material'
import { AddItemForm } from '../../components/AddItemForm/AddItemForm'
import { Todolist } from './Todolist/Todolist'
import { Navigate } from 'react-router-dom'
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useActions } from '../../hooks/useActions'

type PropsType = {
    demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({demo = false}) => {
    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
    const dispatch = useAppDispatch()

    const {fetchTodolists, removeTodolist: removeTodolistThunk, changeTodolistTitle: changeTodolistTitleThunk, addTodolist: addTodolistThunk} = useActions(thunkTodolists)
    const {removeTask: removeTaskThunk, addTask: addTaskThunk, updateTask: updateTaskThunk} = useActions(taskThunks)

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return;
        }
         fetchTodolists()
    }, [])

    const removeTask = useCallback(function (taskId: string, todolistId: string) {
        removeTaskThunk({taskId, todolistId})
        
    }, [])

    const addTask = useCallback(function (title: string, todolistId: string) {
        addTaskThunk({title: title, todolistId:todolistId})
    }, [])

    const changeStatus = useCallback(function (taskId: string, status: TaskStatuses, todolistId: string) {
        updateTaskThunk({taskId, domainModel: {status}, todolistId})
    }, [])

    const changeTaskTitle = useCallback(function (taskId: string, title: string, todolistId: string) {
        updateTaskThunk({taskId, domainModel: {title}, todolistId})
    }, [])

    const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
        const action = changeTodolistFilter({id: todolistId, filter: value})
        dispatch(action)
    }, [])

    const removeTodolist = useCallback(function (id: string) {
        removeTodolistThunk(id)
    }, [])

    const changeTodolistTitle = useCallback(function (id: string, title: string) {
        changeTodolistTitleThunk({id, title})
    }, [])

    const addTodolist = useCallback((title: string) => {
        addTodolistThunk(title)
    }, [])

    if (!isLoggedIn) {
        return <Navigate to={"/login"} />
    }

    console.log(todolists)

    return <>
        <Grid container style={{padding: '20px'}}>
            <AddItemForm addItem={addTodolist}/>
        </Grid>
        <Grid container spacing={3}>
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id]

                    return <Grid item key={tl.id}>
                        <Paper style={{padding: '10px'}}>
                            <Todolist
                                todolist={tl}
                                tasks={allTodolistTasks}
                                removeTask={removeTask}
                                changeFilter={changeFilter}
                                addTask={addTask}
                                changeTaskStatus={changeStatus}
                                removeTodolist={removeTodolist}
                                changeTaskTitle={changeTaskTitle}
                                changeTodolistTitle={changeTodolistTitle}
                                demo={demo}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}
