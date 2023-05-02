import { PrismaClient } from "@prisma/client";
import {
	CreateBoard,
	UpdateBoard,
	UpdateColumn,
	UpdateTask,
} from "electron/types";

export const prisma = new PrismaClient();

export const findAllBoards = async () => {
	return await prisma.board.findMany({
		orderBy: { orderIndex: "asc" },
		include: {
			columns: {
				orderBy: { orderIndex: "asc" },
				include: {
					tasks: {
						orderBy: { orderIndex: "asc" },
					},
				},
			},
		},
	});
};

export const findBoardById = async (id: string) => {
	return await prisma.board.findUnique({ where: { id } });
};

export const createBoard = async (board: CreateBoard) => {
	console.log("createBoard", board);

	const created = await prisma.board.create({
		data: {
			...board,
		},
	});

	return await prisma.board.findFirst({
		where: { id: created.id },
		include: {
			columns: {
				orderBy: { orderIndex: "asc" },
				include: {
					tasks: {
						orderBy: { orderIndex: "asc" },
					},
				},
			},
		},
	});
};

// export const findColumnsByBoardId = async (boardId: string) => {
//     return await prisma.column.findMany({
//         where: { boardId },
//         orderBy: { orderIndex: "asc" },
//     });
// };

export const createColumn = async (column: {
	title: string;
	orderIndex: number;
	boardId: string;
}) => {
	const created = await prisma.column.create({
		data: {
			...column,
		},
	});

	return await prisma.column.findFirst({
		where: { id: created.id },
		include: {
			tasks: {
				orderBy: { orderIndex: "asc" },
			},
		},
	});
};

export const findColumnsByBoardId = async (boardId: string) => {
	return await prisma.column.findMany({
		where: { boardId },
		orderBy: { orderIndex: "asc" },
	});
};

export const createTask = async (task: {
	title: string;
	orderIndex: number;
	columnId: string;
	priority?: string;
	description?: string;
}) => {
	return await prisma.task.create({
		data: {
			...task,
		},
	});
};

export const findTasksByColumnId = async (columnId: string) => {
	return await prisma.task.findMany({
		where: { columnId },
		orderBy: { orderIndex: "asc" },
	});
};

export const updateBoard = async (board: UpdateBoard) => {
	return await prisma.board.update({
		where: { id: board.id },
		data: {
			...board,
		},
	});
};

export const updateColumn = async (column: UpdateColumn) => {
	console.log("updateColumn", column);

	await prisma.column.update({
		where: { id: column.id },
		data: {
			...column,
		},
	});
};

export const updateTask = async (task: UpdateTask) => {
	await prisma.task.update({
		where: { id: task.id },
		data: {
			...task,
		},
	});
};

export const devClearAllBoards = async () => {
	return await prisma.board.deleteMany();
};

export const devClearAllColumns = async () => {
	return await prisma.column.deleteMany();
};

export const devClearAllTasks = async () => {
	return await prisma.task.deleteMany();
};
