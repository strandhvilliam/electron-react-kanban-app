import BoardContext from "@/providers/board-context";
import { forwardRef, useContext } from "react";

interface ColumnMenuProps {
	columnId: string;
}

const ColumnMenu = forwardRef<HTMLDivElement, ColumnMenuProps>(
	({ columnId }, ref) => {
		const { deleteColumn } = useContext(BoardContext);

		const sortOptions = [
			{ text: "Sort by date", handler: () => {} },
			{ text: "Sort by category", handler: () => {} },
			{ text: "Sort by priority", handler: () => {} },
			{ text: "Sort by title", handler: () => {} },
		];
		const actionOptions = [
			{ text: "Add new task", handler: () => {} },
			{ text: "Edit task", handler: () => {} },
			{
				text: "Delete column",
				handler: () => {
					deleteColumn(columnId);
				},
			},
		];
		const filterOptions = [
			{
				text: "Show only priority High",
				img: "/fire.png",
				handler: () => {},
			},
			{
				text: "Show only priority Low",
				img: "/leaf.png",
				handler: () => {},
			},
			{
				text: "Show only priority Standard",
				img: "/moon.png",
				handler: () => {},
			},
		];
		return (
			<div
				ref={ref}
				className="flex flex-col absolute top-10 w-max left-[280px] bg-slate-900 border border-slate-700 text-slate-300 pb-4 z-40 rounded-lg shadow-md shadow-slate-900"
			>
				<h4 className="px-4 py-2 mt-2 text-slate-500 text-sm font-bold ">
					Actions
				</h4>
				<ul>
					{actionOptions.map((option) => (
						<li
							onClick={option.handler}
							key={option.text}
							className="px-4 py-1 hover:bg-slate-800 select-none cursor-default"
						>
							{option.text}
						</li>
					))}
				</ul>
				<h4 className="border-t px-4 py-2 mt-2 text-slate-500 text-sm font-bold border-slate-700">
					Sort
				</h4>
				<ul>
					{sortOptions.map((option) => (
						<li
							onClick={option.handler}
							key={option.text}
							className="px-4 py-1 hover:bg-slate-800 select-none cursor-default"
						>
							{option.text}
						</li>
					))}
				</ul>
				<h4 className="border-t py-2 px-4 mt-2 text-slate-500 text-sm font-bold border-slate-700">
					Filter
				</h4>
				<ul>
					{filterOptions.map((option) => (
						<li
							onClick={option.handler}
							key={option.text}
							className="flex gap-2 items-center px-4 py-1 hover:bg-slate-800 select-none cursor-default"
						>
							<img className="w-4 h-4" src={option.img}></img>
							{option.text}
						</li>
					))}
				</ul>
			</div>
		);
	}
);

export default ColumnMenu;
