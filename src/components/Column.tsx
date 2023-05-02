import { ColumnModel } from "@/shared/types";
import { useContext, useRef, useState } from "react";
import Task from "./Task";
import { Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable as Droppable } from "@/utils/StrictModeDroppable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faEllipsis,
	faEllipsisVertical,
	faPlus,
} from "@fortawesome/free-solid-svg-icons";
import IconButton from "./IconButton";
import Tag from "./Tag";
import OutlineButton from "./OutlineButton";
import BoardContext from "@/providers/board-context";
import { createPortal } from "react-dom";
import useOutsideClick from "@/hooks/useOutsideClick";

interface ColumnProps {
	column: ColumnModel;
	index: number;
}

const Column = ({ column, index }: ColumnProps) => {
	const { createTask, selectedBoard, updateColumn, loadColumn } =
		useContext(BoardContext);
	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const [title, setTitle] = useState(column.title);
	const [menuIsOpen, setMenuIsOpen] = useState(false);

	const menuRef = useRef<HTMLDivElement>(null);
	const menuBtnRef = useRef<HTMLButtonElement>(null);

	const handleCreateTask = async (input: string) => {
		createTask(column.id, input);
	};

	const handleEditTitle = () => {
		loadColumn({ ...column, title });

		if (title !== column.title) {
			updateColumn({ ...column, title });
		}
		setIsEditingTitle(false);
	};

	useOutsideClick([menuRef, menuBtnRef], () => setMenuIsOpen(false));

	return (
		<Draggable draggableId={column.id} index={index}>
			{(provided, snapshot) => (
				<div
					{...provided.draggableProps}
					ref={provided.innerRef}
					className="flex relative max-h-full flex-col w-80  pb-16 shadow-md shadow-slate-950 bg-slate-900 border border-slate-700 rounded-xl mx-4 "
				>
					<div
						{...provided.dragHandleProps}
						onDoubleClick={() => setIsEditingTitle(true)}
						className="flex items-center justify-between px-4 p-3 select-none"
					>
						{!isEditingTitle ? (
							<>
								<h2 className="text-slate-100 text-xl ">
									{column.title}
								</h2>
							</>
						) : (
							<input
								type="text"
								autoFocus
								className="text-slate-100 text-xl bg-slate-900 outline-0"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								onBlur={handleEditTitle}
								onKeyDown={(e) => {
									e.key == "Enter" && handleEditTitle();
								}}
							/>
						)}
						<IconButton
							onClick={() => setMenuIsOpen(!menuIsOpen)}
							ref={menuBtnRef}
							className="shadow-none bg-slate-900 hover:bg-slate-800"
						>
							<FontAwesomeIcon icon={faEllipsis} />
						</IconButton>
					</div>
					{menuIsOpen && (
						<div
							ref={menuRef}
							className="flex flex-col absolute top-10 w-max left-[280px] bg-slate-900 border border-slate-700 text-slate-300 py-4 z-40 rounded-lg shadow-md shadow-slate-900"
						>
							<ul>
								<li className="px-4 py-1 hover:bg-slate-800 select-none cursor-default">
									Add new Task
								</li>
								<li className="px-4 py-1 hover:bg-slate-800 select-none cursor-default">
									Edit task
								</li>

								<li className="px-4 py-1 hover:bg-slate-800 select-none cursor-default">
									Delete
								</li>
							</ul>
							<p className="border-t px-4 py-2 mt-2 text-slate-500 text-sm font-bold border-slate-700">
								Sort
							</p>
							<ul>
								<li className="px-4 py-1 hover:bg-slate-800 select-none cursor-default">
									Sort by date
								</li>
								<li className="px-4 py-1 hover:bg-slate-800 select-none cursor-default">
									Sort by category
								</li>
								<li className="px-4 py-1 hover:bg-slate-800 select-none cursor-default">
									Sort by priority
								</li>
								<li className="px-4 py-1 hover:bg-slate-800 select-none cursor-default">
									Sort alpabetically
								</li>
							</ul>
							<p className="border-t py-2 px-4 mt-2 text-slate-500 text-sm font-bold border-slate-700">
								Filter
							</p>
							<ul>
								<li className="flex items-center gap-2 px-4 py-1 hover:bg-slate-800 select-none cursor-default">
									<img
										className="w-4 h-4"
										src="/fire.png"
									></img>
									Show only priority High
								</li>
								<li className="flex items-center gap-2 px-4 py-1 hover:bg-slate-800 select-none cursor-default">
									<img
										className="w-4 h-4"
										src="/moon.png"
									></img>
									Show only priority Standard
								</li>
								<li className="flex items-center gap-2 px-4 py-1 hover:bg-slate-800 select-none cursor-default">
									<img
										className="w-4 h-4"
										src="/leaf.png"
									></img>
									Show only priority Low
								</li>
							</ul>
						</div>
					)}

					<Droppable droppableId={column.id} type="task">
						{(provided, snapshot) => (
							<div className="flex overflow-y-hidden  flex-col">
								<ul
									{...provided.droppableProps}
									{...provided.droppableProps}
									ref={provided.innerRef}
									className="flex flex-col h-full p-2 bg-slate-900 border-t border-slate-700 rounded-b-xl overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-thumb-rounded-md "
								>
									{column.tasks.map((task, index) => (
										<Task
											key={task.id}
											task={task}
											index={index}
											columnId={column.id}
										/>
									))}

									{provided.placeholder}
								</ul>
							</div>
						)}
					</Droppable>
					<OutlineButton
						className="absolute mx-2 mb-2 bottom-0 left-0 right-0 bg-slate-900 "
						onClick={handleCreateTask}
					>
						<FontAwesomeIcon icon={faPlus} /> Add
					</OutlineButton>
				</div>
			)}
		</Draggable>
	);
};

export default Column;
