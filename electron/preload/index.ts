// ----------------------------------------------------------------------

import { contextBridge, ipcRenderer } from "electron";
import {
	CreateBoard,
	CreateColumn,
	CreateTask,
	UpdateBoard,
	UpdateColumn,
	UpdateTask,
} from "electron/types";

function domReady(
	condition: DocumentReadyState[] = ["complete", "interactive"]
) {
	return new Promise((resolve) => {
		if (condition.includes(document.readyState)) {
			resolve(true);
		} else {
			document.addEventListener("readystatechange", () => {
				if (condition.includes(document.readyState)) {
					resolve(true);
				}
			});
		}
	});
}

const safeDOM = {
	append(parent: HTMLElement, child: HTMLElement) {
		if (!Array.from(parent.children).find((e) => e === child)) {
			return parent.appendChild(child);
		}
	},
	remove(parent: HTMLElement, child: HTMLElement) {
		if (Array.from(parent.children).find((e) => e === child)) {
			return parent.removeChild(child);
		}
	},
};

/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
function useLoading() {
	const className = `loaders-css__square-spin`;
	const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: #fff;
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  z-index: 9;
}
    `;
	const oStyle = document.createElement("style");
	const oDiv = document.createElement("div");

	oStyle.id = "app-loading-style";
	oStyle.innerHTML = styleContent;
	oDiv.className = "app-loading-wrap";
	oDiv.innerHTML = `<div class="${className}"><div></div></div>`;

	return {
		appendLoading() {
			safeDOM.append(document.head, oStyle);
			safeDOM.append(document.body, oDiv);
		},
		removeLoading() {
			safeDOM.remove(document.head, oStyle);
			safeDOM.remove(document.body, oDiv);
		},
	};
}

// ----------------------------------------------------------------------

const { appendLoading, removeLoading } = useLoading();
domReady().then(appendLoading);

window.onmessage = (ev) => {
	ev.data.payload === "removeLoading" && removeLoading();
};

setTimeout(removeLoading, 4999);

contextBridge.exposeInMainWorld("api", {
	invoke: (channel: string, ...args: any) =>
		ipcRenderer.invoke(channel, ...args),

	createBoard: (board: CreateBoard) =>
		ipcRenderer.invoke("create-board", board),
	updateBoard: (board: UpdateBoard) =>
		ipcRenderer.invoke("update-board", board),
	updateColumn: async (column: UpdateColumn) =>
		await ipcRenderer.invoke("update-column", column),
	updateTask: async (task: UpdateTask) =>
		await ipcRenderer.invoke("update-task", task),

	findAllBoards: () => ipcRenderer.invoke("find-all-boards"),
	findBoardById: (id: string) => ipcRenderer.invoke("find-board-by-id", id),
	createColumn: (column: CreateColumn) =>
		ipcRenderer.invoke("create-column", column),
	createTask: (task: CreateTask) => ipcRenderer.invoke("create-task", task),
});

contextBridge.exposeInMainWorld("dev", {
	clearBoards: () => ipcRenderer.invoke("dev-clear-boards"),
	clearColumns: () => ipcRenderer.invoke("dev-clear-columns"),
	clearTasks: () => ipcRenderer.invoke("dev-clear-tasks"),
});
