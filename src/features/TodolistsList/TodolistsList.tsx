import React, { useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { todolistsThunks } from "features/TodolistsList/todolists/todolists.reducer";
import { Grid, Paper } from "@mui/material";
import { AddItemForm } from "common/components";
import { Todolist } from "./Todolist/Todolist";
import { Navigate } from "react-router-dom";
import { useActions } from "common/hooks";
import { selectIsLoggedIn } from "features/auth/auth.selectors";
import { selectTasks } from "features/TodolistsList/tasks/tasks.selectors";
import { selectTodolists } from "features/TodolistsList/todolists/todolists.selectors";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";

export const TodolistsList = () => {
  const todolists = useSelector(selectTodolists);
  const tasks = useSelector(selectTasks);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const windowWidth = useRef(window.innerWidth);

  const {
    removeTodolist: removeTodolistThunk,
    addTodolist,
    fetchTodolists,
    changeTodolistTitle: changeTodolistTitleThunk,
    reorderTodolist,
  } = useActions(todolistsThunks);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    fetchTodolists({});
  }, []);

  const removeTodolist = useCallback(function (id: string) {
    removeTodolistThunk(id);
  }, []);

  const changeTodolistTitle = useCallback(function (id: string, title: string) {
    changeTodolistTitleThunk({ id, title });
  }, []);

  const addTodolistCallback = useCallback((title: string) => {
    return addTodolist(title).unwrap();
  }, []);

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  const onDragEndHanler = (result: DropResult) => {
    const { source, destination, type } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    if (type === "TODOLISTS") {
      const putAfterItemId = todolists.find(
        (_, i) => i === destination.index
      )?.id;

      reorderTodolist({
        todolistId: result.draggableId,
        putAfterItemId: putAfterItemId,
      });
    } else if (type === "TASKS") {
      const todolistId =
        tasks[
          result.draggableId
        ]; /* .find((el: TaskType[]) => el.id === result.draggableId) */
      console.log(todolistId);
    }
  };

  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodolistCallback} />
      </Grid>
      <DragDropContext onDragEnd={onDragEndHanler}>
        <Droppable
          droppableId="todolistslist"
          type="TODOLISTS"
          direction={`${
            windowWidth.current < 1186 ? "vertical" : "horizontal"
          }`}
        >
          {(provided) => (
            <Grid
              container
              spacing={3}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {todolists.map((tl, i) => {
                let allTodolistTasks = tasks[tl.id];

                return (
                  <Draggable key={tl.id} draggableId={`${tl.id}`} index={i}>
                    {(draggableProvided, draggablesnapshot) => {
                      return (
                        <Grid
                          item
                          key={tl.id}
                          ref={draggableProvided.innerRef}
                          {...draggableProvided.draggableProps}
                          {...draggableProvided.dragHandleProps}
                        >
                          <Paper style={{ padding: "10px" }}>
                            <Todolist
                              todolist={tl}
                              tasks={allTodolistTasks}
                              removeTodolist={removeTodolist}
                              changeTodolistTitle={changeTodolistTitle}
                              key={tl.id}
                            />
                          </Paper>
                          {draggablesnapshot.isDragging && (
                            <div style={{ width: "20px", height: "20px" }} />
                          )}
                        </Grid>
                      );
                    }}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </Grid>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};
