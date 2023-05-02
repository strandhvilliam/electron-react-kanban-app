import { forwardRef } from "react";

interface IconButtonProps {
	children: React.ReactNode;
	className?: string;
	onClick: () => void;
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
	({ children, className, onClick }: IconButtonProps, ref) => {
		return (
			<>
				<button
					ref={ref}
					onClick={onClick}
					className={`flex items-center justify-center bg-slate-800 text-slate-400 shadow-sm shadow-slate-900 rounded-lg hover:bg-slate-700 cursor-default w-6 h-6 ${
						className && className
					}`}
				>
					{children}
				</button>
			</>
		);
	}
);

export default IconButton;
