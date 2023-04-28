import { ReactNode, useEffect, useState } from "react";
import BoardContext from "./board-context";
import { BoardModel, ColumnModel } from "@/shared/types";
import { updateColumn } from "electron/main/db";

interface BoardProviderProps {
	children: ReactNode;
}

const BoardProvider = ({ children }: BoardProviderProps) => {
	const [boards, setBoards] = useState<BoardModel[]>([]);
	const [selectedBoard, setSelectedBoard] = useState<BoardModel | null>(null);

	const selectBoard = async (id: string) => {
		const board = boards.find((b) => b.id === id);
		if (board) {
			setSelectedBoard(board);
		}
	};

	const createBoard = async (title: string) => {
		const board = {
			title,
			orderIndex: boards.length || 0,
		};

		const resBoard: BoardModel = await window.api.createBoard(board);

		console.log(resBoard);

		setBoards((prev) => [...prev, resBoard]);
		selectBoard(resBoard.id);
	};

	const updateBoard = async (board: BoardModel) => {
		const updateBoard = {
			...board,
			orderIndex: boards.indexOf(board),
		};

		const resBoard: BoardModel = await window.api.updateBoard(updateBoard);
		setBoards((prev) =>
			prev.map((b) => (b.id === resBoard.id ? resBoard : b))
		);
		setSelectedBoard(resBoard);
	};

	const updateColumn = async (column: ColumnModel) => {
		const updateColumn = {
			id: column.id,
			title: column.title,
			orderIndex:
				selectedBoard?.columns.findIndex((c) => c.id === column.id) ||
				0,
		};

		await window.api.updateColumn(updateColumn);

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

	const createColumn = async (title: string) => {
		if (!selectedBoard) return;
		const columnIndex = selectedBoard.columns.length || 0;
		const column = {
			title,
			orderIndex: columnIndex,
			boardId: selectedBoard.id,
		};

		const resCol: ColumnModel = await window.api.createColumn(column);

		console.log(resCol);

		setBoards((prev) =>
			prev.map((b) =>
				b.id === selectedBoard.id
					? { ...b, columns: [...b.columns, resCol] }
					: b
			)
		);

		setSelectedBoard((prev) => {
			if (!prev) return null;
			return {
				...prev,
				columns: [...prev.columns, resCol],
			};
		});
	};

	const createTask = async (columnId: string, title: string) => {
		if (!selectedBoard) return;
		const targetColumn = selectedBoard.columns.find(
			(c) => c.id === columnId
		);
		if (!targetColumn) return;

		const taskIndex = targetColumn.tasks.length || 0;
		const task = {
			title,
			orderIndex: taskIndex,
			columnId,
		};

		console.log(task);

		const resTask = await window.api.createTask(task);

		setBoards((prev) =>
			prev.map((b) =>
				b.id === selectedBoard.id
					? {
							...b,
							columns: b.columns.map((c) =>
								c.id === columnId
									? { ...c, tasks: [...c.tasks, resTask] }
									: c
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
					c.id === columnId
						? { ...c, tasks: [...c.tasks, resTask] }
						: c
				),
			};
		});
	};

	useEffect(() => {
		const fetchBoards = async () => {
			const result: BoardModel[] = await window.api.findAllBoards();
			console.log(result);

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
			}}
		>
			{children}
		</BoardContext.Provider>
	);
};

export default BoardProvider;
