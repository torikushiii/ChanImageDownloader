const got = require("got");
const fs = require("fs/promises");
const logger = require("./lib/logger");
const { blacklist } = require("./config");

const getThreads = async (board) => {
	const res = await got({
		url: `https://api.4chan.org/${board}/catalog.json`,
		responseType: "json",
		throwHttpErrors: false
	});

	return res.body
		.flatMap(i => i.threads)
		.filter(i => !i.sticky && !i.closed && i.replies >= 5);
};

const filterThreads = (threads, prefix) => {
	if (Array.isArray(prefix)) {
		return threads.filter(i => prefix.includes(i.sub))
			.map(i => ({
				id: i.no,
				content: `${i.sub}`,
				modified: new Date(i.last_modified * 1000),
				created: new Date(i.time * 1000)
			}));
	}
	else if (typeof prefix === "string") {
		return threads.filter(i => i.sub?.includes(`${prefix}`))
			.map(i => ({
				id: i.no,
				content: `${i.sub}`,
				modified: new Date(i.last_modified * 1000),
				created: new Date(i.time * 1000)
			}));
	}
	else if (prefix instanceof RegExp) {
		return threads.filter(i => i.sub?.match(prefix))
			.map(i => ({
				id: i.no,
				content: `${i.sub}`,
				modified: new Date(i.last_modified * 1000),
				created: new Date(i.time * 1000)
			}));
	}
};

const createDirectory = async (path) => {
	try {
		await fs.access(path);
	}
	catch {
		await fs.mkdir(path, "0777");
	}
};

// eslint-disable-next-line max-params
const downloadImage = async (board, threadName, options = {}) => {
	const { id: threadId, filename, ext, tim } = options;
	const path = `./img/${threadName}/${threadId}`;

	try {
		const file = await fs.open(`${path}/${tim}${ext}`, "r");
		await file.close();
	}
	catch {
		logger.info(`Downloading ${filename}${ext} from ${board}/${threadId} [${threadName}]`);
		const res = await got({
			url: `https://i.4cdn.org/${board}/${tim}${ext}`,
			responseType: "buffer",
			throwHttpErrors: false
		});

		await createDirectory(path);

		const file = await fs.open(`${path}/${tim}${ext}`, "w");
		await file.write(res.body);

		await file.close();
	}
};

const processThread = async (board, threadName, thread, blacklist) => {
	const res = await got({
		url: `https://a.4cdn.org/${board}/thread/${thread.id}.json`,
		responseType: "json",
		throwHttpErrors: false
	});

	const post = res.body.posts.filter(i => i.filename && i.ext && !blacklist.includes(i.md5));

	for (const i of post) {
		await downloadImage(board, threadName, {
			id: thread.id,
			filename: i.filename,
			ext: i.ext,
			tim: i.tim
		});
	}
};

const processThreads = async (board, threadName, threads, blacklist) => {
	try {
		await fs.access(`./img/${threadName}`);
	}
	catch {
		await fs.mkdir(`./img/${threadName}`, "0777");
	}

	for (const thread of threads) {
		await processThread(board, threadName, thread, blacklist);
	}
};

const processBoards = async (boards) => {
	for (const board of Object.keys(boards)) {
		const threads = await getThreads(board);
		for (const thread of boards[board]) {
			const threadList = filterThreads(threads, thread.prefix);
			await processThreads(board, thread.folderName, threadList, blacklist);
		}
	}
};

module.exports = {
	processBoards
};
