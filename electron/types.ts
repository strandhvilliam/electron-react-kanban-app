export interface CreateBoard {
	title: string;
	orderIndex: number;
}

export interface CreateColumn {
	title: string;
	orderIndex: number;
	boardId: string;
}

export interface CreateTask {
	title: string;
	orderIndex: number;
	columnId: string;
	priority?: string;
	description?: string;
}

export interface UpdateBoard {
	id: string;
	title?: string;
	orderIndex?: number;
}

export interface UpdateColumn {
	id: string;
	title?: string;
	orderIndex?: number;
	boardId?: string;
}

export interface UpdateTask {
	id: string;
	title?: string;
	orderIndex?: number;
	columnId?: string;
	priority?: string;
	description?: string;
}


