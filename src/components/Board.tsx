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
import { ColumnModel, TaskModel } from "@/shared/types";

const Board = () => {
	const {
		selectedBoard,
		createColumn,
		updateTask,
		updateColumn,
		updateBoard,
		loadColumn,
		loadBoard,
	} = useContext(BoardContext);

	const handleCreateColumn = (input: string) => {
		createColumn(input);
	};

	const moveTaskWithinColumn = async (
		col: ColumnModel,
		sourceIndex: number,
		destIndex: number,
		task: TaskModel
	) => {
		const newTasks = Array.from(col.tasks);

		newTasks.splice(sourceIndex, 1);
		newTasks.splice(destIndex, 0, task!);

		const newCol: ColumnModel = {
			...col,
			tasks: newTasks,
		};

		await loadColumn(newCol);

		for (const t of newTasks) {
			await updateTask(col.id, {
				...t,
				orderIndex: newTasks.indexOf(t),
			});
		}
	};

	const moveTaskBetweenColumns = async (
		startCol: ColumnModel,
		endCol: ColumnModel,
		sourceIndex: number,
		destIndex: number,
		task: TaskModel
	) => {
		const startColTasks = Array.from(startCol.tasks);
		startColTasks.splice(sourceIndex, 1);
		const newStartCol: ColumnModel = {
			...startCol,
			tasks: startColTasks,
		};

		const endColTasks = Array.from(endCol.tasks);
		endColTasks.splice(destIndex, 0, task!);
		const newEndCol: ColumnModel = {
			...endCol,
			tasks: endColTasks,
		};

		await loadColumn(newStartCol);
		await loadColumn(newEndCol);

		for (const t of startColTasks) {
			await updateTask(newStartCol.id, {
				...t,
				orderIndex: startColTasks.indexOf(t),
			});
		}

		for (const t of endColTasks) {
			await updateTask(newEndCol.id, {
				...t,
				orderIndex: endColTasks.indexOf(t),
			});
		}
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
			const newColumns = Array.from(selectedBoard.columns);

			newColumns.splice(source.index, 1);
			newColumns.splice(
				destination.index,
				0,
				selectedBoard.columns[source.index]
			);

			const newBoard = {
				...selectedBoard,
				columns: newColumns,
			};

			await loadBoard(newBoard);

			for (const c of newColumns) {
				const index = newBoard.columns.indexOf(c);
				const newCol = {
					...c,
					orderIndex: index,
				};
				await updateColumn(newCol);
			}
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

			if (!task) return;

			if (startCol === endCol) {
				await moveTaskWithinColumn(
					startCol,
					source.index,
					destination.index,
					task
				);
			} else {
				await moveTaskBetweenColumns(
					startCol,
					endCol,
					source.index,
					destination.index,
					task
				);
			}
		}
	};

	return (
		<div className="w-full min-h-full max-h-full flex flex-col overflow-hidden">
			<div className="flex h-12 p-4 space-x-4 items-center px-4 border-b border-slate-700">
				<h1 className="text-xl font-bold text-slate-100">
					{selectedBoard?.title}
				</h1>
				<SecondaryButton onClick={() => {}} className="text-xs">
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
									className="w-64 h-min flex-shrink-0"
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
