import React from "react";
import { TaskType } from "features/TodolistsList/tasks/tasks.api";
import { Task } from "./Task/Task";
import { TodolistDomainType } from "features/TodolistsList/todolists/todolists.reducer";
import { TaskStatuses } from "common/enums";

type Props = {
  todolist: TodolistDomainType;
  tasks: TaskType[];
};

export const Tasks = ({ todolist, tasks }: Props) => {
  let tasksForTodolist = tasks;

  if (todolist.filter === "active") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.New);
  }
  if (todolist.filter === "completed") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.Completed);
  }

  return (
    <div>
      {tasksForTodolist.map((t, index) => (
        <Task key={t.id} task={t} todolistId={todolist.id} />
      ))}
    </div>
  );
};
