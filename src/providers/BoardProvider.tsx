import { ReactNode, memo, useEffect, useState } from "react";
import BoardContext from "./board-context";
import { BoardModel, ColumnModel, TaskModel } from "@/shared/types";
import { updateColumn } from "electron/main/db";

interface BoardProviderProps {
	children: ReactNode;
}

const BoardProvider = memo(({ children }: BoardProviderProps) => {
	const [boards, setBoards] = useState<BoardModel[]>([]);
	const [selectedBoard, setSelectedBoard] = useState<BoardModel | null>(null);

	const selectBoard = (id: string) => {
		const board = boards.find((b) => b.id === id);
		if (!board) return;
		setSelectedBoard(board);
	};

	const createBoard = async (title: string) => {
		const orderIndex = boards.length || 0;

		const resBoard: BoardModel = await window.api.createBoard({
			title,
			orderIndex,
		});

		setBoards((prev) => [...prev, resBoard]);
		selectBoard(resBoard.id);
	};

	const updateBoard = async (board: BoardModel) => {
		const orderIndex = boards.indexOf(board);

		const resBoard: BoardModel = await window.api.updateBoard({
			...board,
			orderIndex,
		});
		loadBoard(resBoard);
	};

	const loadBoard = async (board: BoardModel) => {
		setBoards((prev) => prev.map((b) => (b.id === board.id ? board : b)));
		setSelectedBoard(board);
	};

	const updateColumn = async (column: ColumnModel) => {
		await window.api.updateColumn({
			id: column.id,
			title: column.title,
			orderIndex: column.orderIndex,
			boardId: selectedBoard!.id,
		});
	};

	const loadColumn = async (column: ColumnModel) => {
		setBoards((prev) =>
			prev.map((b) =>
				b.id === selectedBoard!.id
					? {
							...b,
							columns: b.columns.map((c) =>
								c.id === column.id ? column : c
							),
					  }
					: b
			)
		);

		setSelectedBoard((prev) => {
			if (!prev) return null;
			return {
				...prev,
				columns: prev.columns.map((c) =>
					c.id === column.id ? column : c
				),
			};
		});
	};

	const updateTask = async (columnId: string, task: TaskModel) => {
		const column = selectedBoard!.columns.find((c) => c.id === columnId);
		if (!column) return;
		const updateTask = {
			...task,
			columnId: column.id,
		};

		await window.api.updateTask(updateTask);
	};

	const createColumn = async (title: string) => {
		if (!selectedBoard) return;
		const columnIndex = selectedBoard.columns.length || 0;
		const column = {
			title,
			orderIndex: columnIndex,
			boardId: selectedBoard.id,
		};

		const resCol: ColumnModel = await window.api.createColumn(column);

		const newBoard: BoardModel = {
			...selectedBoard,
			columns: [...selectedBoard.columns, resCol],
		};

		loadBoard(newBoard);
	};

	const createTask = async (columnId: string, title: string) => {
		if (!selectedBoard) return;
		const targetColumn = selectedBoard.columns.find(
			(c) => c.id === columnId
		);
		if (!targetColumn) return;
		const taskIndex = targetColumn.tasks.length || 0;
		const resTask: TaskModel = await window.api.createTask({
			title,
			orderIndex: taskIndex,
			columnId,
		});

		const newColumn: ColumnModel = {
			...targetColumn,
			tasks: [...targetColumn.tasks, resTask],
		};

		loadColumn(newColumn);
	};

	useEffect(() => {
		const fetchBoards = async () => {
			const result: BoardModel[] = await window.api.findAllBoards();
			setBoards(result);
			setSelectedBoard(result[0]);
		};
		fetchBoards();
	}, []);

	return (
		<BoardContext.Provider
			value={{
				boards,
				selectedBoard,
				selectBoard,
				createColumn,
				createTask,
				createBoard,
				updateBoard,
				updateColumn,
				updateTask,
				loadColumn,
				loadBoard,
			}}
		>
			{children}
		</BoardContext.Provider>
	);
});

export default BoardProvider;
