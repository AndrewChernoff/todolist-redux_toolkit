import { instance } from 'common/api/common.api';
import { ResponseType } from 'common/types';

export const todolistsApi = {
	getTodolists() {
		return instance.get<TodolistType[]>('todo-lists');
	},
	createTodolist(title: string) {
		return instance.post<ResponseType<{ item: TodolistType }>>('todo-lists', {title: title});
	},
	deleteTodolist(id: string) {
		return instance.delete<ResponseType>(`todo-lists/${id}`);
	},
	updateTodolist(arg: UpdateTodolistTitleArgType) {
		return instance.put<ResponseType>(`todo-lists/${arg.id}`, {title: arg.title});
	},
	reorderTodolist(data: {todolistId: string, putAfterItemId: string}) {
		return instance.put<ResponseType<any>>(`todo-lists/${data.todolistId}/reorder`, {putAfterItemId: data.putAfterItemId});
	},
	reorderTasks(data: {todolistId: string, taskId: string, putAfterItemId: string}) {
		return instance.put<ResponseType<any>>(`todo-lists/${data.todolistId}/tasks/${data.taskId}/reorder`, {putAfterItemId: data.putAfterItemId});
	},
}

// Types
export type TodolistType = {
	id: string
	title: string
	addedDate: string
	order: number
}

export type UpdateTodolistTitleArgType = {
	id: string
	title: string
}

