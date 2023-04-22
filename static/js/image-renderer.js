/* eslint-disable no-undef */
window.addEventListener("load", async () => {
	const folderPath = window.location.pathname.split("/")[2];
	if (!folderPath) {
		return;
	}

	const idPath = window.location.pathname.split("/")[3];
	if (!idPath) {
		return;
	}

	const res = await fetch(`/folders/${folderPath}/${idPath}?${Date.now()}`, { method: "POST" });
	const files = await res.json();
	const domain = window.location.origin;
	const container = document.querySelector(".container");
	const itemsPerPage = 36;

	const reqBoard = await fetch(`/api/${folderPath}?${Date.now()}`);
	const resBoard = await reqBoard.text();

	let currentPage = 1;
	let startIndex = (currentPage - 1) * itemsPerPage;
	let endIndex = startIndex + itemsPerPage;

	const renderPage = () => {
		container.innerHTML = "";
		const imageWrapper = document.createElement("div");
		imageWrapper.classList.add("image-wrapper");

		const h1 = document.createElement("h1");
		const board = document.createElement("span");

		board.textContent = folderPath.toUpperCase();
		board.style.color = "white";
		board.style.fontSize = "1.2rem";
		
		h1.appendChild(board);
		h1.appendChild(document.createTextNode(` / ${idPath} / ${files.length} Images`));
		h1.style.color = "white";
		h1.style.fontSize = "1.2rem";
		h1.style.marginBottom = "1rem";

		const boardLink = document.createElement("a");
		boardLink.href = `https://boards.4chan.org/${resBoard}/thread/${idPath}`;
		boardLink.target = "_blank";
		boardLink.textContent = "Open Original Board";

		boardLink.style.color = "white";
		boardLink.style.fontSize = "1.2rem";
		boardLink.style.marginBottom = "1rem";

		h1.appendChild(document.createTextNode(" / "));
		h1.appendChild(boardLink);
		
		imageWrapper.appendChild(h1);

		for (let i = startIndex; i < endIndex && i < files.length; i++) {
			const file = files[i];
			const ext = file.split(".")[1].toLowerCase();
			if (ext === "mp4" || ext === "webm") {
				const video = document.createElement("video");
				video.classList.add("video", "lazy-load");
				video.controls = true;
				video.height = 120;
				video.width = 120;
				video.setAttribute("data-src", `${domain}/img/${folderPath}/${idPath}/${file}`);
				imageWrapper.appendChild(video);
			}
			else {
				const imgButton = document.createElement("button");
				imgButton.classList.add("img-button", "lazy-load", "lazy-clickable");
				imgButton.style.backgroundImage = `url(${domain}/img/${folderPath}/${idPath}/${file})`;
				imgButton.setAttribute("data-src", `${domain}/img/${folderPath}/${idPath}/${file}`);
				imgButton.addEventListener("click", () => {
					window.open(`${domain}/img/${folderPath}/${idPath}/${file}`, "_blank");
				});

				imageWrapper.appendChild(imgButton);
			}
		}

		container.appendChild(imageWrapper);

		const lazyLoadImages = document.querySelectorAll(".lazy-load");
		const observerOptions = {
			rootMargin: "50%"
		};

		const observer = new IntersectionObserver((entries, observer) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					const element = entry.target;
					const src = element.getAttribute("data-src");
					if (element.tagName === "IMG") {
						element.setAttribute("src", src);
					}
					else if (element.tagName === "VIDEO") {
						element.setAttribute("src", src);
					}
					else {
						element.style.backgroundImage = `url(${src})`;
					}

					element.classList.remove("lazy-load");

					if (element.classList.contains("lazy-clickable")) {
						element.addEventListener("click", () => {
							window.open(src, "_blank");
						});

						element.classList.remove("lazy-clickable");
					}

					observer.unobserve(element);
				}
			}
		}, observerOptions);

		for (const image of lazyLoadImages) {
			observer.observe(image);
		}
	};

	const renderPagination = () => {
		const totalPages = Math.ceil(files.length / itemsPerPage);
		const pagination = document.createElement("div");
		pagination.classList.add("pagination");

		for (let i = 1; i <= totalPages; i++) {
			const pageLink = document.createElement("a");
			pageLink.href = "#";
			pageLink.textContent = i;

			if (i === currentPage) {
				pageLink.classList.add("active");
			}

			pageLink.addEventListener("click", (event) => {
				event.preventDefault();
				currentPage = i;
				startIndex = (currentPage - 1) * itemsPerPage;
				endIndex = startIndex + itemsPerPage;
				renderPage();
				renderPagination();
			});

			pagination.appendChild(pageLink);
		}

		const imageWrapper = document.querySelector(".image-wrapper");
		const oldPagination = document.querySelector(".pagination");
		if (oldPagination) {
			imageWrapper.removeChild(oldPagination);
		}
		
		imageWrapper.appendChild(pagination);
	};

	renderPage();
	renderPagination();
});
