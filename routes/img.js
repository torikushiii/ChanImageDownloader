const fs = require("fs/promises");

module.exports = function (fastify, opts, done) {
	fastify.get("/:folder/:subfolder/:id", async (request, reply) => {
		const id = request.params.id;
		const folder = request.params.folder;
		const website = request.query.website;
		const subfolder = request.params.subfolder;

		if (website) {
			const fileData = await fs.readFile(`./img/${folder}/${subfolder}/${id}`);
			return fileData;
		}
		else {
			const fileData = await fs.readFile(`./img/${folder}/${subfolder}/${id}`);
			const extension = id.split(".").pop();
			switch (extension) {
				case "png":
				case "jpg":
				case "jpeg":
				case "gif":
					reply.type(`image/${extension}`);
					break;
				case "mp4":
				case "webm":
					reply.type("video/mp4");
					break;
				default:
					reply.type("image/png");
					break;
			}

			return fileData;
		}
	});

	fastify.post("/data", async (request) => {
		const data = request.body;
		const folder = data.folder;
		const subfolder = data.subfolder;
		const images = data.images;

		const fileList = [];
		for (const image of images) {
			fileList.push({
				name: image,
				path: `/img/${folder}/${subfolder}/${image}`
			});
		}

		return fileList;
	});

	done();
};
