export const convertDate = (date: Date) => {
	if (new Date().getTime() - date.getTime() < 1000 * 60) {
		return "Just now";
	}

	if (
		date.getDate() == new Date().getDate() &&
		new Date().getHours() === date.getHours()
	) {
		return `${Math.abs(
			new Date().getMinutes() - date.getMinutes()
		)} minutes ago`;
	}

	if (date.getDate == new Date().getDate) {
		return `${Math.abs(
			new Date().getHours() - date.getHours()
		)}  hours ago`;
	}

	if (date.getDate() == new Date().getDate() - 1) {
		return "Yesterday";
	}

	return date.toLocaleDateString();
};
