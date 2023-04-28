import { ReactNode, useRef, MouseEvent } from "react";

interface ModalProps {
	children: ReactNode;
	close: () => void;
	className?: string;
}

const Modal = ({ children, close, className }: ModalProps) => {
	const ref = useRef<HTMLDivElement>(null);

	const closeHandler = (event: MouseEvent<HTMLDivElement>) => {
		if (ref.current && !ref.current.contains(event.target as Node)) {
			close();
		}
	};

	return (
		<>
			<div
				onClick={closeHandler}
				className="fixed top-0 left-0 w-full h-full bg-slate-950 opacity-60"
			></div>
			<div
				ref={ref}
				className={`${
					className ? className : null
				}  bg-slate-800 p-6 border border-slate-700 shadow-lg shadow-slate-950 rounded-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
			>
				{children}
			</div>
		</>
	);
};

export default Modal;
