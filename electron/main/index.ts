import { app, BrowserWindow, shell, ipcMain } from "electron";
import { release } from "node:os";
import { join } from "node:path";
import { update } from "./update";
import {
	createBoard,
	createColumn,
	createTask,
	deleteBoard,
	deleteColumn,
	deleteTask,
	devClearAllBoards,
	devClearAllColumns,
	findAllBoards,
	findBoardById,
	updateBoard,
	updateColumn,
	updateTask,
} from "./db";
import path from "path";
import {
	CreateBoard,
	CreateColumn,
	CreateTask,
	UpdateBoard,
	UpdateColumn,
	UpdateTask,
} from "electron/types";

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, "../");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
	? join(process.env.DIST_ELECTRON, "../public")
	: process.env.DIST;

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
	app.quit();
	process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, "../preload/index.js");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");

async function createWindow() {
	win = new BrowserWindow({
		title: "Main window",
		icon: join(process.env.PUBLIC, "favicon.ico"),
		width: 1200,
		height: 800,
		titleBarStyle: "hidden",
		trafficLightPosition: { x: 6, y: 6 },

		webPreferences: {
			preload,
			// Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
			// Consider using contextBridge.exposeInMainWorld
			// Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
			nodeIntegration: true,
			contextIsolation: true,
		},
	});

	if (url) {
		// electron-vite-vue#298
		win.loadURL(url);
		// Open devTool if the app is not packaged
		win.webContents.openDevTools();
	} else {
		win.loadFile(indexHtml);
	}

	// Test actively push message to the Electron-Renderer
	win.webContents.on("did-finish-load", () => {
		win?.webContents.send(
			"main-process-message",
			new Date().toLocaleString()
		);
	});

	// Make all links open with the browser, not with the application
	win.webContents.setWindowOpenHandler(({ url }) => {
		if (url.startsWith("https:")) shell.openExternal(url);
		return { action: "deny" };
	});

	// Apply electron-updater
	update(win);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
	win = null;
	if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
	if (win) {
		// Focus on the main window if the user tried to open another
		if (win.isMinimized()) win.restore();
		win.focus();
	}
});

app.on("activate", () => {
	const allWindows = BrowserWindow.getAllWindows();
	if (allWindows.length) {
		allWindows[0].focus();
	} else {
		createWindow();
	}
});

// New window example arg: new windows url
ipcMain.handle("open-win", (_, arg) => {
	const childWindow = new BrowserWindow({
		webPreferences: {
			preload,
			nodeIntegration: true,
			contextIsolation: true,
		},
	});

	if (process.env.VITE_DEV_SERVER_URL) {
		childWindow.loadURL(`${url}#${arg}`);
	} else {
		childWindow.loadFile(indexHtml, { hash: arg });
	}
});

// ---------------------------------------------------

const dbPath = path.join(__dirname, "../../prisma/dev.db");

ipcMain.handle(
	"create-board",
	async (_, board: CreateBoard) => await createBoard(board)
);

ipcMain.handle(
	"create-column",
	async (_, column: CreateColumn) => await createColumn(column)
);

ipcMain.handle(
	"create-task",
	async (_, task: CreateTask) => await createTask(task)
);

ipcMain.handle(
	"update-board",
	async (_, board: UpdateBoard) => await updateBoard(board)
);

ipcMain.handle(
	"update-column",
	async (_, column: UpdateColumn) => await updateColumn(column)
);

ipcMain.handle(
	"update-task",
	async (_, task: UpdateTask) => await updateTask(task)
);
ipcMain.handle(
	"delete-task",
	async (_, taskId: string) => await deleteTask(taskId)
);
ipcMain.handle(
	"delete-column",
	async (_, columnId: string) => await deleteColumn(columnId)
);
ipcMain.handle(
	"delete-board",
	async (_, boardId: string) => await deleteBoard(boardId)
);

ipcMain.handle("find-all-boards", async () => await findAllBoards());

ipcMain.handle("find-board-by-id", async (_, id) => {
	const board = await findBoardById(id);
	return board;
});

ipcMain.handle("dev-clear-boards", async () => {
	await devClearAllBoards();
	return true;
});

ipcMain.handle("dev-clear-columns", async () => {
	await devClearAllColumns();
	return true;
});
