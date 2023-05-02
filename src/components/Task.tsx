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
import { useContext, useState } from "react";
import BoardContext from "@/providers/board-context";

interface TaskProps {
	// task: TaskModel;
	task: TaskModel;
	index: number;
	columnId: string;
}

const priorities = ["standard", "low", "high"];

const Task = ({ task, index, columnId }: TaskProps) => {
	const { updateTask } = useContext(BoardContext);
	const handleEditTask = () => {};
	const [testPriority, setTestPriority] = useState(task.priority);

	const handlePriorityChange = async () => {
		const currentIndex = priorities.indexOf(testPriority);
		const nextIndex = (currentIndex + 1) % priorities.length;
		const nextPriority = priorities[nextIndex];
		setTestPriority(nextPriority);
		await updateTask(columnId, { ...task, priority: nextPriority });
	};

	return (
		<Draggable draggableId={task.id} index={index}>
			{(provided, snapshot) => (
				<li
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					ref={provided.innerRef}
					className={`grid grid-cols-4 px-3 py-3 my-2 bg-slate-800 text-slate-400 border border-slate-800 shadow shadow-neutral-950 rounded-xl text-md select-none group`}
					onClick={handleEditTask}
				>
					<Tag text={"category"} className="col-span-3" />
					<IconButton
						onClick={() => {}}
						className="justify-self-end shadow-transparent invisible group-hover:visible"
					>
						<FontAwesomeIcon icon={faEllipsisVertical} />
					</IconButton>
					<span className="text-xs text-slate-500 col-span-3">
						{convertDate(task.createdAt)}
					</span>
					<span className="flex col-span-3 whitespace-normal overflow-hidden text-md text-slate-100">
						{task.title}
					</span>
					<IconButton
						onClick={handlePriorityChange}
						className="justify-self-end shadow-transparent "
					>
						{testPriority === "standard" && (
							<img src="/moon.png" className="w-4" />
						)}
						{testPriority === "low" && (
							<img src="/leaf.png" className="w-4" />
						)}
						{testPriority === "high" && (
							<img src="/fire.png" className="w-4" />
						)}
					</IconButton>
				</li>
			)}
		</Draggable>
	);
};

export default Task;
