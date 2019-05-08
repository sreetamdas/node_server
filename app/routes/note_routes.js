const fs = require("fs");
const path = require("path");

module.exports = function(app, db) {
	app.post("/bulk_upload", (req, res) => {
		console.log(req.body);
		const json = JSON.stringify(req.body, null, 4);

		const dir = path.join(__dirname, "..", "data");
		console.log({ dir });
		if (!fs.existsSync(dir)) {
			console.log("here");
			fs.mkdirSync(dir);
		}

		const filePath = path.join(dir, "data.json")
		fs.writeFileSync(filePath, json, error => {
			if (error) {
				console.error(error);
				res.status(500).send("Error in writing file.");
			}

			console.log("File written");
		});
		res.status(200).send("Status: 200");
	});
	app.get("/", (req, res) => {
		console.log("GET /");
		res.status(200).send("Status: 200");
		// res.
	});
};
