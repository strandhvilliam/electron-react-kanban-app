interface PrimaryButtonProps {
	children: React.ReactNode;
	className?: string;
	onClick?: () => void;
}

const PrimaryButton = ({
	children,
	className,
	onClick,
}: PrimaryButtonProps) => {
	return (
		<>
			<button
				onClick={onClick}
				className={`${
					className && className
				} px-3 py-1 rounded-md bg-indigo-700 shadow-sm shadow-slate-900 text-slate-200 text-sm hover:bg-indigo-600`}
			>
				{children}
			</button>
		</>
	);
};

export default PrimaryButton;
