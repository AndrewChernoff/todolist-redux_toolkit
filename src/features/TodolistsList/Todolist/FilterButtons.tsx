import React, { useCallback} from 'react'
import { Button } from '@mui/material'
import { TodolistDomainType, todolistsActions } from '../todolists/todolists.reducer'
import { useActions } from 'common/hooks'

type Props = {
    todolist: TodolistDomainType
}

export const FilterButtons = ({todolist}: Props) => {

	const {changeTodolistFilter} = useActions(todolistsActions)


    const onAllClickHandler = useCallback(() => changeTodolistFilter({filter: 'all', id: todolist.id}), [todolist.id, changeTodolistFilter])
	const onActiveClickHandler = useCallback(() => changeTodolistFilter({filter: 'active', id: todolist.id}), [todolist.id, changeTodolistFilter])
	const onCompletedClickHandler = useCallback(() => changeTodolistFilter({filter: 'completed', id: todolist.id}), [todolist.id, changeTodolistFilter])

    return (<>
    <Button variant={todolist.filter === 'all' ? 'outlined' : 'text'}
					onClick={onAllClickHandler}
					color={'inherit'}
			>All
			</Button>
			<Button variant={todolist.filter === 'active' ? 'outlined' : 'text'}
					onClick={onActiveClickHandler}
					color={'primary'}>Active
			</Button>
			<Button variant={todolist.filter === 'completed' ? 'outlined' : 'text'}
					onClick={onCompletedClickHandler}
					color={'secondary'}>Completed
			</Button>
        </>)
}
