export interface TaskModel {
	id: string;
	title: string;
	description?: string;
	priority: string;
	orderIndex: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface ColumnModel {
	id: string;
	title: string;
	tasks: TaskModel[];
	// orderIndex: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface BoardModel {
	id: string;
	title: string;
	columns: ColumnModel[];
	// orderIndex: number;
	createdAt: Date;
	updatedAt: Date;
}
