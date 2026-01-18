import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "../../../ProjectsModule/Components/ProjectForm/ProjectForm.module.css";
import styles2 from "./AllTasksEmploye.module.css";
import { useMode } from "../../../../../Context/ModeContext";
import { http } from "../../../../../Services/Api/httpInstance";
import { Employee_URLS } from "../../../../../Services/Api/ApisUrls";
import type { DragEndEvent } from "@dnd-kit/core";

import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDroppable,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import TaskCardSortable from "./TaskCardSortable";
import type { ApiTask, TaskStatus } from "./TaskCardSortable";

function Column({
  id,
  title,
  className,
  children,
}: {
  id: TaskStatus;
  title: string;
  className: string;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="col-md-4 d-flex flex-column">
      <h2 className="my-3">{title}</h2>

      <div
        ref={setNodeRef}
        className={className}
        style={{ outline: isOver ? "2px dashed rgba(0,0,0,0.25)" : "none" }}
      >
        {children}
      </div>
    </div>
  );
}

type TasksResponse = {
  pageNumber: number;
  pageSize: number;
  data: ApiTask[];
  totalNumberOfRecords: number;
  totalNumberOfPages: number;
};

export default function AllTasksEmployee() {
  const navigate = useNavigate();
  const { darkMode } = useMode();

  const [TodoTasks, setTodoTasks] = useState<ApiTask[]>([]);
  const [InProgressTasks, setInProgressTasks] = useState<ApiTask[]>([]);
  const [DoneTasks, setDoneTasks] = useState<ApiTask[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const getTasksByStatus = async (status: TaskStatus) => {
    const res = await http.get<TasksResponse>(Employee_URLS.GET_TASK, {
      params: { status, pageSize: 10, pageNumber: 1 },
    });
    return res.data;
  };

  const changeTaskStatus = async (taskId: number, status: TaskStatus) => {
    const res = await http.put(Employee_URLS.CHANGE_STUTUS(taskId), { status });
    return res.data;
  };

  useEffect(() => {
    (async () => {
      try {
        const [todo, inProgress, done] = await Promise.all([
          getTasksByStatus("ToDo"),
          getTasksByStatus("InProgress"),
          getTasksByStatus("Done"),
        ]);

        setTodoTasks(todo.data);
        setInProgressTasks(inProgress.data);
        setDoneTasks(done.data);
      } catch (e) {
        console.error("Failed to fetch tasks", e);
      }
    })();
  }, []);

  const findContainer = (id: any): TaskStatus | null => {
    if (id === "ToDo" || id === "InProgress" || id === "Done") return id;

    const taskId = Number(id);
    if (TodoTasks.some((t) => t.id === taskId)) return "ToDo";
    if (InProgressTasks.some((t) => t.id === taskId)) return "InProgress";
    if (DoneTasks.some((t) => t.id === taskId)) return "Done";
    return null;
  };

  const findTask = (id: number) =>
    TodoTasks.find((t) => t.id === id) ||
    InProgressTasks.find((t) => t.id === id) ||
    DoneTasks.find((t) => t.id === id);

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = Number(active.id);
    const overId = over.id;

    const from = findContainer(activeId);
    const to = findContainer(overId);

    if (!from || !to) return;

    // 1) Reorder داخل نفس العمود
    if (from === to) {
      const reorder = (arr: ApiTask[]) => {
        const oldIndex = arr.findIndex((t) => t.id === activeId);
        const newIndex =
          overId === from
            ? arr.length - 1
            : arr.findIndex((t) => t.id === Number(overId));

        if (oldIndex === -1 || newIndex === -1) return arr;
        return arrayMove(arr, oldIndex, newIndex);
      };

      if (from === "ToDo") setTodoTasks(reorder);
      if (from === "InProgress") setInProgressTasks(reorder);
      if (from === "Done") setDoneTasks(reorder);
      return;
    }

    // 2) نقل بين الأعمدة (UI first)
    const task = findTask(activeId);
    if (!task) return;

    if (from === "ToDo")
      setTodoTasks((prev) => prev.filter((t) => t.id !== activeId));
    if (from === "InProgress")
      setInProgressTasks((prev) => prev.filter((t) => t.id !== activeId));
    if (from === "Done")
      setDoneTasks((prev) => prev.filter((t) => t.id !== activeId));

    const moved: ApiTask = { ...task, status: to };

    if (to === "ToDo") setTodoTasks((prev) => [...prev, moved]);
    if (to === "InProgress") setInProgressTasks((prev) => [...prev, moved]);
    if (to === "Done") setDoneTasks((prev) => [...prev, moved]);

    // 3) API call
    try {
      await changeTaskStatus(activeId, to);
    } catch (e) {
      console.error("change status failed", e);
      // (اختياري) rollback لو حبيتي بعدين
    }
  };

  return (
    <>
      <div
        className={`${styles["page-header"]} ${
          darkMode ? styles.pageHeaderDark : styles.pageHeaderLight
        }`}
      >
        <h2 className={`${darkMode ? "text-light" : "primary-color2"} small m-3`}>
          Tasks Board
        </h2>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={onDragEnd}
      >
        <div className="container-fluid px-3 overflow-hidden min-vh-100">
          <div className="row g-5">
            <Column
              id="ToDo"
              title="To Do"
              className={`${styles2.card} ${styles2.todo}`}
            >
              <SortableContext
                items={TodoTasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                {TodoTasks.map((task) => (
                  <TaskCardSortable key={task.id} task={task} />
                ))}
              </SortableContext>
            </Column>

            <Column
              id="InProgress"
              title="In Progress"
              className={`${styles2.card} ${styles2.inProgress}`}
            >
              <SortableContext
                items={InProgressTasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                {InProgressTasks.map((task) => (
                  <TaskCardSortable key={task.id} task={task} />
                ))}
              </SortableContext>
            </Column>

            <Column
              id="Done"
              title="Done"
              className={`${styles2.card} ${styles2.done}`}
            >
              <SortableContext
                items={DoneTasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                {DoneTasks.map((task) => (
                  <TaskCardSortable key={task.id} task={task} />
                ))}
              </SortableContext>
            </Column>
          </div>
        </div>
      </DndContext>
    </>
  );
}
