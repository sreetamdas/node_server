const fs = require("fs");
const path = require("path");

var neo4j = require("neo4j-driver").v1;
var driver = neo4j.driver(
	"bolt://localhost",
	neo4j.auth.basic("neo4j", "asdasdasd"),
);
module.exports = function(app) {
	app.post("/bulk_upload", (req, res) => {
		const json = JSON.stringify(req.body, null, 4);

		const dir = path.join(__dirname, "bulkUploadData");
		console.log({ dir });
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
		}

		const filePath = path.join(dir, "data.json");
		fs.writeFileSync(filePath, json, error => {
			if (error) {
				res.status(500).send("Error in writing file: ", {
					error,
				});
			}
		});
		let session = driver.session();
		session
			.run(
				`
				WITH "${filePath}" AS json_url
				CALL apoc.load.json(json_url, '$.data.First') YIELD value
				RETURN First, count(*)
				)
				`,
			)
			.then(result => {
				if (result) {
					res.status(200).send(result);
				}
				session.close();
			})
			.catch(error => {
				res.status(500).send(error);
			});
		fs.unlinkSync(filePath);
	});
	app.get("/", (req, res) => {
		console.log("GET /");
		res.status(200).send("Status: 200");
		// res.
	});
};
