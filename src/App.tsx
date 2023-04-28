import RootLayout from "./components/RootLayout";
import Board from "./components/Board";
import { useEffect } from "react";
import BoardProvider from "./providers/BoardProvider";
// import { test } from "electron/preload";
// import { ipcRenderer } from "electron";
// import { api, getUser } from "../electron/preload";

const INITIAL_DATA: any = {
	tasks: [
		{ id: "task-1", content: "Take out the garbage" },
		{ id: "task-2", content: "Watch my favorite show" },
		{ id: "task-3", content: "Charge my phone" },
		{ id: "task-4", content: "Cook dinner" },
	],
	columns: [
		{
			id: "startCol-1",
			title: "To do",
			taskIds: ["task-1", "task-2", "task-3", "task-4"],
		},
		{
			id: "startCol-2",
			title: "In progress",
			taskIds: [],
		},
		/*{
			id: "startCol-3",
			title: "Done",
			taskIds: [],
		}, */
	],

	columnOrder: ["startCol-1", "startCol-2", "startCol-3"],
};

function App() {
	const handleClick = (msg: string) => {
		// window.api.send("test", { message: msg });
	};

	return (
		<BoardProvider>
			<RootLayout>
				<Board />
			</RootLayout>
		</BoardProvider>
	);
}

export default App;
