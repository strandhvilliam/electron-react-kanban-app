import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SecondaryButton from "./IconButton";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { createPortal } from "react-dom";
import { useContext, useRef, useState } from "react";
import Modal from "./Modal";
import BoardContext from "@/providers/board-context";
import { BoardModel } from "@/shared/types";

interface BoardNavProps {
	visible: boolean;
}

const BoardNav = ({ visible }: BoardNavProps) => {
	const { boards, createBoard, selectBoard } = useContext(BoardContext);

	const [modalIsVisible, setModalIsVisible] = useState(false);
	const newTitleRef = useRef<HTMLInputElement>(null);

	const showModal = () => {
		setModalIsVisible(true);
	};

	const handleCreateBoard = async () => {
		if (!newTitleRef.current) return;

		createBoard(newTitleRef.current.value);
		selectBoard(boards[boards.length - 1].id);
		setModalIsVisible(false);
	};

	const handleSelectBoard = (id: string) => {
		console.log("select board", id);

		selectBoard(id);
	};

	return visible ? (
		<div className=" flex flex-col flex-shrink-0 border-r border-slate-700 w-44 select-none">
			<div className="flex px-4 h-12 items-center justify-between border-b border-slate-700">
				<h1 className=" font-bold text-slate-200  cursor-default">
					Boards
				</h1>
				<SecondaryButton
					onClick={showModal}
					className="w-6 h-6 text-slate-200 text-xs "
				>
					<FontAwesomeIcon className="w-full" icon={faPlus} />
				</SecondaryButton>
			</div>

			<ul className="flex flex-col   text-slate-200">
				{boards &&
					boards.map((board) => (
						<li
							key={board.id}
							onClick={() => handleSelectBoard(board.id)}
							className=" px-4 py-2 hover:bg-slate-800 cursor-default"
						>
							{board.title}
						</li>
					))}
			</ul>
			{modalIsVisible &&
				createPortal(
					<Modal close={() => setModalIsVisible(false)}>
						<div className="flex flex-col space-y-2 w-64 mb-4">
							<label
								htmlFor="board-title"
								className="text-slate-200"
							>
								Board Title
							</label>
							<input
								ref={newTitleRef}
								type="text"
								name="board-title"
								id="board-title"
								autoFocus
								className="bg-slate-700 border border-slate-600 rounded-md px-2 py-1 text-slate-200 outline-0"
							/>
						</div>
						<div className="flex justify-end space-x-2">
							<button
								onClick={() => setModalIsVisible(false)}
								className="px-3 py-1 rounded-md bg-slate-700 text-slate-200 text-sm"
							>
								Cancel
							</button>
							<button
								onClick={handleCreateBoard}
								className="px-3 py-1 rounded-md bg-indigo-700 shadow-sm shadow-slate-900 text-slate-200 text-sm hover:bg-indigo-600"
							>
								Create
							</button>
						</div>
					</Modal>,
					document.body
				)}
		</div>
	) : (
		<div></div>
	);
};

export default BoardNav;
