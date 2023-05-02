import { Draggable } from "react-beautiful-dnd";
import { TaskModel } from "../shared/types";
import SecondaryButton from "./IconButton";
import Tag from "./Tag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { convertDate } from "@/utils/helpers";
import {
	faEllipsis,
	faEllipsisVertical,
	faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import IconButton from "./IconButton";
import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import BoardContext from "@/providers/board-context";
import useOutsideClick from "@/hooks/useOutsideClick";
import { createPortal } from "react-dom";
import Modal from "./Modal";
import PrimaryButton from "./PrimaryButton";
import ColumnMenu from "./ColumnMenu";

interface TaskProps {
	// task: TaskModel;
	task: TaskModel;
	index: number;
	columnId: string;
}

const priorities = ["standard", "low", "high"];

const Task = ({ task, index, columnId }: TaskProps) => {
	const { updateTask } = useContext(BoardContext);
	const handleEditTask = (e: FormEvent) => {
		e.preventDefault();
	};
	const [priority, setPriority] = useState(task.priority);
	const [isEditing, setIsEditing] = useState(false);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [xAbsolute, setXAbsolute] = useState(0);
	const [yAbsolute, setYAbsolute] = useState(0);
	const menuRef = useRef<HTMLDivElement>(null);
	const menuBtnRef = useRef<HTMLButtonElement>(null);

	const handleClick = () => {
		setIsEditing(!isEditing);
		setXAbsolute(mousePosition.x + 10);
		setYAbsolute(mousePosition.y + 10);
	};

	const handleMouseMove = (e: any) => {
		setMousePosition({ x: e.pageX, y: e.pageY });
	};

	const handlePriorityChange = async () => {
		const currentIndex = priorities.indexOf(priority);
		const nextIndex = (currentIndex + 1) % priorities.length;
		const nextPriority = priorities[nextIndex];
		setPriority(nextPriority);
		await updateTask(columnId, { ...task, priority: nextPriority });
	};

	useOutsideClick([menuRef, menuBtnRef], () => setIsEditing(false));

	return (
		<Draggable draggableId={task.id} index={index}>
			{(provided, snapshot) => (
				<>
					{isEditing &&
						createPortal(
							<div
								ref={menuRef}
								style={{
									position: "absolute",
									left: `${xAbsolute}px`,
									top: `${yAbsolute}px`,
								}}
							>
								<div className="flex flex-col p-4 bg-slate-900 border border-slate-700 text-slate-300 pb-4 z-40 rounded-lg shadow-md shadow-slate-900">
									<form
										onSubmit={handleEditTask}
										className="flex flex-col items-start gap-1"
									>
										<label
											htmlFor="edit-title"
											className="text-slate-200"
										>
											Title
										</label>
										<input
											type="text"
											spellCheck={false}
											id="edit-title"
											className="bg-slate-700 border border-slate-600 rounded-md px-2 py-1 text-slate-200 outline-0 mb-2"
											autoFocus
											value={task.title}
											onChange={() => {}}
										/>
										<label
											htmlFor="edit-category"
											className="text-slate-200"
										>
											Category
										</label>
										<select
											id="edit-category"
											className="bg-slate-700 border border-slate-600 rounded-md px-1 py-1 text-slate-200 outline-0 w-full mb-2"
										>
											<option value="cat-1">
												Category 1
											</option>
											<option value="cat-2">
												Category 2
											</option>
											<option value="cat-3">
												Category 3
											</option>
											<option value="cat-4">
												Category 4
											</option>
											<option value="cat-5">
												Category 5
											</option>
											<option value="cat-6">
												Category 6
											</option>
										</select>
										<PrimaryButton className="self-end">
											Save
										</PrimaryButton>
									</form>
								</div>
							</div>,
							document.body
						)}
					<li
						{...provided.draggableProps}
						{...provided.dragHandleProps}
						onMouseMove={handleMouseMove}
						ref={provided.innerRef}
						className={` grid grid-cols-4 px-3 py-3 my-2 bg-slate-800 text-slate-400 border border-slate-800 shadow shadow-neutral-950 rounded-xl text-md select-none group`}
					>
						{/* {isEditing &&
							createPortal(
								<div
									className={`absolute  max-z-index  bg-slate-950 text-white`}
								>
									testataeta
								</div>,
								document.querySelector("#root")!
							)} */}
						{/* {isEditing &&
							createPortal(
								<Modal close={() => setIsEditing(false)}>
									<form
										onSubmit={handleEditTask}
										className="flex flex-col items-start gap-1"
									>
										<label
											htmlFor="edit-title"
											className="text-slate-200"
										>
											Title
										</label>
										<input
											type="text"
											id="edit-title"
											className="bg-slate-700 border border-slate-600 rounded-md px-2 py-1 text-slate-200 outline-0 mb-2"
											autoFocus
											value={task.title}
											onChange={() => {}}
										/>
										<label
											htmlFor="edit-category"
											className="text-slate-200"
										>
											Category
										</label>
										<select
											id="edit-category"
											className="bg-slate-700 border border-slate-600 rounded-md px-1 py-1 text-slate-200 outline-0 w-full mb-2"

											>
											<option value="cat-1">
												Category 1
											</option>
											<option value="cat-2">
												Category 2
											</option>
											<option value="cat-3">
												Category 3
											</option>
											<option value="cat-4">
												Category 4
											</option>
											<option value="cat-5">
												Category 5
											</option>
											<option value="cat-6">
												Category 6
											</option>
										</select>
										<PrimaryButton className="self-end">
											Save
										</PrimaryButton>
									</form>
								</Modal>,
								document.body
							)} */}
						<Tag text={"category"} className="col-span-3" />
						<IconButton
							ref={menuBtnRef}
							onClick={handleClick}
							className="justify-self-end shadow-transparent invisible group-hover:visible"
						>
							<FontAwesomeIcon icon={faPenToSquare} />
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
							{priority === "standard" && (
								<img src="/moon.png" className="w-4" />
							)}
							{priority === "low" && (
								<img src="/leaf.png" className="w-4" />
							)}
							{priority === "high" && (
								<img src="/fire.png" className="w-4" />
							)}
						</IconButton>
					</li>
				</>
			)}
		</Draggable>
	);
};

export default Task;
