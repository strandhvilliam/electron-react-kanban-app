interface TagProps {
	text: string;
}

const Tag = ({ text }: TagProps) => {
	return (
		<>
			<span className="col-span-2 py-1 mb-3 px-3 text-xs text-center max-w-max shadow-sm shadow-slate-900 bg-indigo-900 text-indigo-200 rounded-full">
				{text}
			</span>
		</>
	);
};

export default Tag;
