const fs = require("fs");
const path = require("path");

const neo4j = require("neo4j-driver").v1;
const driver = neo4j.driver(
	"bolt://34.83.20.5:7687",
	neo4j.auth.basic("neo4j", "asdasdasd"),
);

module.exports = function(app, db) {
	app.post("/bulk_upload", (req, res) => {
		let session = driver.session();
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
		console.log("file written, executing cypher");

		session
			.run(`CREATE (n: NODE { name: "test_node2" })`)
			.then(result => {
				if (result) {
					res.status(200).send(result);
				}
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
		// console.log("Get All Nodes", session);
		// console.log("driver >>>>>", driver);
		let session = driver.session();
		console.log("here");
		
		session
			.run("MATCH (n) RETURN n")
			.then(result => {
				if (result) {
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
