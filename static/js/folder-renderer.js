/* eslint-disable no-undef */
window.addEventListener("load", async () => {
	const currentPath = window.location.pathname;
	const folderName = currentPath.split("/")[2];
	const idPath = currentPath.split("/")[3];

	if (!folderName) {
		return;
	}
	else if (folderName && idPath) {
		return;
	}

	const res = await fetch(`/folders/subfolders/${folderName}?${Date.now()}`);
	const folders = await res.json();

	const folderList = createFolderList(folderName, folders);
	const container = document.querySelector(".container");
    
	const currentFolder = document.createElement("h1");
	currentFolder.classList.add("current-folder");
	currentFolder.textContent = folderName.toUpperCase();

	container.appendChild(currentFolder);
	currentFolder.appendChild(folderList);
});

const createFolderList = (path, folders) => {
	const folderList = document.createElement("div");
	folderList.classList.add("folder-list", "horizontal");
  
	for (const folder of folders) {
		const folderButton = document.createElement("button");
		folderButton.classList.add("folder-button");
		folderButton.textContent = folder;
		folderButton.addEventListener("click", () => {
			window.location.href = `/folders/${path}/${folder}`;
		});
  
		folderList.appendChild(folderButton);
	}
  
	return folderList;
};
