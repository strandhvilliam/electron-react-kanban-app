import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { StrictModeDroppable as Droppable } from "../utils/StrictModeDroppable";
import Column from "./Column";
import SecondaryButton from "./IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faMapPin,
	faPlus,
	faThumbtack,
} from "@fortawesome/free-solid-svg-icons";
import OutlineButton from "./OutlineButton";
import { useContext, useEffect } from "react";
import BoardContext from "@/providers/board-context";
import { ColumnModel } from "@/shared/types";
import { updateTask } from "electron/main/db";

const Board = () => {
	const {
		selectBoard,
		selectedBoard,
		createColumn,
		updateBoard,
		updateColumn,
	} = useContext(BoardContext);

	console.log(selectedBoard?.columns);

	const handleCreateColumn = (input: string) => {
		createColumn(input);
	};

	const onDragEnd = async (result: DropResult) => {
		const { destination, source, draggableId, type } = result;

		if (!destination) return;
		if (!selectedBoard) return;

		if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
		)
			return;

		if (type === "column") {
		}

		if (type === "task") {
			const startCol = selectedBoard.columns.find(
				(column) => column.id === source.droppableId
			);

			const endCol = selectedBoard.columns.find(
				(column) => column.id === destination.droppableId
			);

			if (!startCol || !endCol) return;
			const task = startCol.tasks.find((task) => task.id === draggableId);

			if (startCol === endCol) {
				const newTasks = Array.from(startCol.tasks);

				newTasks.splice(source.index, 1);
				newTasks.splice(destination.index, 0, task!);

				const newCol: ColumnModel = {
					...startCol,
					tasks: newTasks,
				};

				updateColumn(newCol);
			} else {
				const startColTasks = Array.from(startCol.tasks);
				startColTasks.splice(source.index, 1);
				const newStartCol: ColumnModel = {
					...startCol,
					tasks: startColTasks,
				};

				const endColTasks = Array.from(endCol.tasks);
				endColTasks.splice(destination.index, 0, task!);
				const newEndCol: ColumnModel = {
					...endCol,
					tasks: endColTasks,
				};

				await updateColumn(newStartCol);
				await updateColumn(newEndCol);
			}
		}
	};

	return (
		<div className="w-full min-h-full max-h-full flex flex-col overflow-hidden">
			<div className="flex h-12 p-4 space-x-4 items-center px-4 border-b border-slate-700">
				<h1 className="text-xl font-bold text-slate-100">
					{selectedBoard?.title}
				</h1>
				<SecondaryButton className="text-xs">
					<FontAwesomeIcon icon={faThumbtack} />
				</SecondaryButton>
			</div>
			<div className="flex flex-grow pb-2 mt-6 mx-2 overflow-y-hidden overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-thumb-rounded-md scroll-smooth">
				<DragDropContext onDragEnd={onDragEnd}>
					<Droppable
						droppableId="kanban-board"
						direction="horizontal"
						type="column"
					>
						{(provided, snapshot) => (
							<>
								<div
									{...provided.droppableProps}
									ref={provided.innerRef}
									className="flex items-start justify-center"
								>
									{selectedBoard?.columns.map(
										(column, index) => (
											<Column
												key={column.id}
												column={column}
												index={index}
											/>
										)
									)}

									{provided.placeholder}
								</div>
								<OutlineButton
									onClick={handleCreateColumn}
									className="w-64 h-min"
								>
									<FontAwesomeIcon
										icon={faPlus}
										className=""
									/>{" "}
									New Column
								</OutlineButton>
							</>
						)}
					</Droppable>
				</DragDropContext>
			</div>
		</div>
	);
};

export default Board;
