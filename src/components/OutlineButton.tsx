import { FormEvent, useRef, useState } from "react";

interface OutlineButtonProps {
	children: React.ReactNode;
	onClick: (input: string) => void;
	className?: string;
}

const OutlineButton = ({
	children,
	onClick,
	className,
}: OutlineButtonProps) => {
	const [inputVisible, setInputVisible] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleFocus = () => {
		setInputVisible(true);
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		setInputVisible(false);
		if (inputRef.current && inputRef.current.value) {
			onClick(inputRef.current.value);
		}
	};

	return (
		<button
			onClick={handleFocus}
			className={`${className ? className : ""} ${
				!inputVisible && "px-4 py-4"
			} rounded-xl border border-slate-700 text-slate-400 text-sm font-bold hover:text-slate-200 `}
		>
			{inputVisible && (
				<form onSubmit={handleSubmit}>
					<input
						autoFocus
						ref={inputRef}
						onBlur={() => setInputVisible(false)}
						type="text"
						className=" bg-slate-900 rounded-xl px-4 py-4 w-full text-slate-200 outline-0"
					/>
				</form>
			)}
			{!inputVisible && children}
		</button>
	);
};

export default OutlineButton;
