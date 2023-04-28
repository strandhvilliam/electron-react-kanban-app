import { ColumnModel } from "@/shared/types";
import { useContext } from "react";
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

interface ColumnProps {
	// column: ColumnModel;
	column: ColumnModel;
	index: number;
}

const Column = ({ column, index }: ColumnProps) => {
	const { createTask, selectedBoard } = useContext(BoardContext);

	// const column = selectedBoard?.columns.find((c) => c.id === id);

	const handleCreateTask = async (input: string) => {
		createTask(column.id, input);
	};

	return (
		<Draggable draggableId={column.id} index={index}>
			{(provided, snapshot) => (
				<div
					{...provided.draggableProps}
					ref={provided.innerRef}
					className="flex relative max-h-full flex-col w-80 overflow-hidden pb-16 shadow-md shadow-slate-950 bg-slate-900 border border-slate-700 rounded-xl mx-4 "
				>
					<div
						{...provided.dragHandleProps}
						className="flex items-center justify-between px-4 p-3 select-none"
					>
						<h2 className="text-slate-100 text-xl ">
							{column.title}
						</h2>
						<IconButton className="shadow-none bg-slate-900 hover:bg-slate-800">
							<FontAwesomeIcon icon={faEllipsis} />
						</IconButton>
					</div>

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
