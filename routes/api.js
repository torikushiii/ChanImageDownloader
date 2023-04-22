const fs = require("fs/promises");
const config = require("../config");

module.exports = function (fastify, opts, done) {
	fastify.get("/folders", async () => {
		const folderData = await fs.readdir("./img");
		const folderList = config.boardList;
        
		if (folderData.length === 0) {
			return [];
		}

		const folders = [];
		for (const [board, boardFolders] of Object.entries(folderList)) {
			for (const folder of boardFolders) {
				if (folderData.includes(folder.folderName)) {
					if (folder.hidden) {
						continue;
					}

					folders.push(folder.folderName);
				}
			}
		}

		return folders.sort();
	});

	fastify.get("/:board", async (request) => {
		const boardReq = request.params.board;
		const folderList = config.boardList;

		for (const [board, boardFolders] of Object.entries(folderList)) {
			for (const folder of boardFolders) {
				if (folder.folderName === boardReq) {
					return board;
				}
			}
		}
	});

	done();
};
