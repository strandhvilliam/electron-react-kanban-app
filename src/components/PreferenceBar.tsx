import {
	faCheckCircle,
	faCog,
	faRectangleList,
	faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface PreferenceBarProps {
	toggleList: () => void;
}

const PreferenceBar = ({ toggleList }: PreferenceBarProps) => {
	return (
		<div className="flex px-3 py-2 flex-col max-w-xs items-center justify-between border-r border-slate-700">
			<ul className="flex flex-col space-y-4 text-slate-400 text-xl text-center">
				<li className=" hover:text-slate-200" onClick={toggleList}>
					<FontAwesomeIcon icon={faRectangleList} />
				</li>
				<li className=" hover:text-slate-200">
					<FontAwesomeIcon icon={faCheckCircle} />
				</li>
			</ul>
			<ul className="flex flex-col text-slate-400 space-y-4 text-xl text-center">
				<li className=" hover:text-slate-200">
					<FontAwesomeIcon icon={faUser} />
				</li>
				<li className=" hover:text-slate-200">
					<FontAwesomeIcon icon={faCog}></FontAwesomeIcon>
				</li>
			</ul>
		</div>
	);
};

export default PreferenceBar;
