export const convertDate = (date: Date) => {
	if (new Date().getTime() - date.getTime() < 1000 * 60) {
		return "Just now";
	}

	if (
		date.getDate() == new Date().getDate() &&
		date.getTime() - new Date().getTime() < 1000 * 60 * 60
	) {
		return `${new Date().getMinutes() - date.getMinutes()} minutes ago`;
	}

	if (date.getDate == new Date().getDate) {
		return `${new Date().getHours() - date.getHours()}  hours ago`;
	}

	if (date.getDate() == new Date().getDate() - 1) {
		return "Yesterday";
	}

	return date.toLocaleDateString();
};
