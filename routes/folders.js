const fs = require("fs");

module.exports = function (fastify, opts, done) {
	fastify.get("/:folder", async (request, reply) => {
		const folder = request.params.folder;
		const path = `./img/${folder}`;

		if (!fs.existsSync(path)) {
			return reply.code(404).send({ error: "Folder not found" });
		}

		return reply.sendFile("index.html");
	});

	fastify.get("/subfolders/:folder", async (request) => {
		const folder = request.params.folder;
		const path = `./img/${folder}`;

		const folders = fs.readdirSync(path);

		if (folders.length === 0) {
			return [];
		}

		return folders.reverse();
	});

	fastify.get("/:subfolders/:id", async (request, reply) => reply.sendFile("index.html"));
	fastify.post("/:subfolders/:id", async (request) => {
		const folder = request.params.subfolders;
		const id = request.params.id;

		const path = `./img/${folder}/${id}`;
		const nodeList = fs.readdirSync(path);

		if (nodeList.length === 0) {
			return [];
		}

		const files = nodeList
			.map(i => ({
				name: i,
				time: fs.statSync(`${path}/${i}`).mtime.getTime()
			}))
			.sort((a, b) => b.time - a.time)
			.map(i => i.name);

		return files;
	});

	done();
};
