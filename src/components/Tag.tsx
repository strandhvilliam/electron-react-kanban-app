interface TagProps {
	text: string;
	className: string;
}

const Tag = ({ text, className }: TagProps) => {
	return (
		<>
			<span className={`${className && className} py-1 mb-3 px-3 text-xs text-center max-w-max shadow-sm shadow-slate-900 bg-indigo-900 text-indigo-200 rounded-full`}>
				{text}
			</span>
		</>
	);
};

export default Tag;
