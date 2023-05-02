import { BoardModel, ColumnModel } from "@/shared/types";
import { createContext } from "react";

interface ContextType {
	boards: BoardModel[];
	selectedBoard: BoardModel | null;
	selectBoard: (id: string) => void;
	createColumn: (title: string) => void;
	createTask: (title: string, columnId: string) => void;
	createBoard: (title: string) => void;
	updateBoard: (board: BoardModel) => void;
	updateColumn: (column: ColumnModel) => void;
	updateTask: (columnId: string, task: any) => void;
	deleteBoard: (boardId: string) => void;
	deleteColumn: (columnId: string) => void;
	deleteTask: (columnId: string, taskId: string) => void;
	loadColumn: (column: ColumnModel) => void;
	loadBoard: (board: BoardModel) => void;
}

const BoardContext = createContext<ContextType>({
	boards: [],
	selectedBoard: null,
	selectBoard: () => {},
	createColumn: () => {},
	createTask: () => {},
	createBoard: () => {},
	updateBoard: () => {},
	updateColumn: () => {},
	updateTask: () => {},
	deleteBoard: () => {},
	deleteColumn: () => {},
	deleteTask: () => {},
	loadColumn: () => {},
	loadBoard: () => {},
});

export default BoardContext;
