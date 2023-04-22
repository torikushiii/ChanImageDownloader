const { CronJob } = require("cron");
const logger = require("./lib/logger");
const fastify = require("./lib/fastify");
const { boardList } = require("./config");
const { processBoards } = require("./chan");

let isJobRunning = false;

logger.info("Starting cron job...");
const job = new CronJob("* * * * *", async () => {
	if (!isJobRunning) {
		isJobRunning = true;
		
		try {
			await processBoards(boardList);
			isJobRunning = false;
		}
		catch (e) {
			isJobRunning = false;
			logger.error(e);
		}
	}
});

job.start();

(async function () {
	const config = require("./config");
	if (!config.host || !config.port) {
		logger.error("Config file is missing host or port");
		process.exit(1);
	}

	fastify.get("/favicon.ico", (req, res) => res.sendFile("favicon.ico"));

	fastify.get("/robots.txt", (req, res) => {
		res.type("text/plain");
		res.send("User-agent: *\nDisallow: /");
	});

	fastify.register(require("./routes/api"), { prefix: "/api" });
	fastify.register(require("./routes/folders"), { prefix: "/folders" });
	fastify.register(require("./routes/img"), { prefix: "/img" });

	fastify.listen({ port: config.port, host: config.host });
})();
