import { Draggable } from "react-beautiful-dnd";
import { TaskModel } from "../shared/types";
import SecondaryButton from "./IconButton";
import Tag from "./Tag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { convertDate } from "@/utils/helpers";
import {
	faEllipsis,
	faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import IconButton from "./IconButton";

interface TaskProps {
	// task: TaskModel;
	task: TaskModel;
	index: number;
}

const Task = ({ task, index }: TaskProps) => {
	const handleEditTask = () => {};

	return (
		<Draggable draggableId={task.id} index={index}>
			{(provided, snapshot) => (
				<li
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					ref={provided.innerRef}
					className={`grid grid-cols-3 px-3 py-3 my-2 bg-slate-800 text-slate-400 border border-slate-800 shadow shadow-neutral-950 rounded-xl text-md select-none group`}
					onClick={handleEditTask}
				>
					<Tag text={task.priority} />
					<IconButton className="justify-self-end shadow-transparent invisible group-hover:visible">
						<FontAwesomeIcon icon={faEllipsisVertical} />
					</IconButton>
					<span className="text-xs text-slate-500 col-span-3">
						{convertDate(task.createdAt)}
					</span>
					<span className="col-span-3 text-md text-slate-100">
						{task.title}
					</span>
				</li>
			)}
		</Draggable>
	);
};

export default Task;
