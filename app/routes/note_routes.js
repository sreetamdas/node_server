const fs = require("fs");
const path = require("path");

var neo4j = require("neo4j-driver").v1;
var driver = neo4j.driver(
	"bolt://localhost",
	neo4j.auth.basic("neo4j", "asdasdasd"),
);
var session = driver.session();
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
		console.log("file written, executing cypher", session);

		session
			.run(
				`CREATE (n: NODE { name: "test_node"})
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
		session.close();
		driver.close();
	});
	app.get("/", (req, res) => {
		console.log("GET /");
		res.status(200).send("Status: 200");
		// res.
	});
	app.get("/getAllNodes", (req, res) => {
		console.log("Get All Nodes", session);
		console.log("driver >>>>>", driver);
		session
			.run("MATCH (n) RETURN n")
			.then(result => {
				if(result) {
					res.status(200).send(result);
				}
				session.close();
			})
			.catch(error => {
				res.status(500).send(error);
			});
		session.close();
		driver.close();
	});
};
