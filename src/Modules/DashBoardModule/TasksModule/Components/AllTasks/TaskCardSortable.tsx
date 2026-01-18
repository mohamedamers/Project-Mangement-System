import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styles2 from "./AllTasksEmploye.module.css";

export type TaskStatus = "ToDo" | "InProgress" | "Done";

export type ApiTask = {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  creationDate: string;
  modificationDate: string;
};

export default function TaskCardSortable({ task }: { task: ApiTask }) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } =
    useSortable({
      id: task.id, 
      data: { status: task.status },
    });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={styles2.taskCard}
      {...attributes}
      {...listeners}
    >
      <h6 className={styles2.taskTitle}>{task.title}</h6>
      <i className={`fa-solid fa-arrow-up-right-from-square ${styles2.taskIcon}`} />
    </div>
  );
}
