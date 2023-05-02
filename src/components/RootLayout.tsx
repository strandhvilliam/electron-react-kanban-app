import { ReactNode, useState } from "react";
import PreferenceBar from "./PreferenceBar";
import BoardNav from "./BoardNav";

interface RootLayoutProps {
	children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
	const [listIsVisible, setListIsVisible] = useState(true);

	const toggleList = () => {
		setListIsVisible(!listIsVisible);
	};

	return (
		<main className="flex flex-grow min-h-screen max-h-screen relative">
			<div className="bg-transparent absolute top-0 left-0 right-0 h-5 draggable-bar"></div>
			<PreferenceBar toggleList={toggleList} />
			<BoardNav visible={listIsVisible} />
			{children}
		</main>
	);
};

export default RootLayout;
