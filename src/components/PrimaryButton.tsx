interface PrimaryButtonProps {
	children: React.ReactNode;
	className?: string;
}

const PrimaryButton = ({ children, className }: PrimaryButtonProps) => {
	return (
		<>
			<button
				className={`${
					className && className
				} bg-indigo-800 text-slate-100 shadow-sm shadow-slate-950 rounded-lg hover:bg-slate-700 cursor-default`}
			>
				{children}
			</button>
		</>
	);
};

export default PrimaryButton;
