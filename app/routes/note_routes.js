const fs = require("fs");
const path = require("path");

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
      // headers: node1 node1-label node2 node2-label relationship-name direction
      WITH "${filePath}" AS json_url
	  CALL apoc.load.json(json_url, '$.data.First') YIELD value
	  RETURN First, count(*)
    //   UNWIND value.data	AS item

    //   FOREACH (uselessVar IN CASE WHEN line.Second IS NULL THEN [1] ELSE [] END | 
    //   // no second node, no rel
    //     MERGE (src: line[0] { name: line[1] })
    //   )
    //   FOREACH (uselessVar IN CASE WHEN line.Second IS NOT NULL AND line.Relationship IS NULL THEN [1] ELSE [] END |
    //   // second but no rel, create both nodes
    //     MERGE (src: line[0] { name: line[1] })
    //     MERGE (dest: line[2] { name: line[3] })
    //   )
    //   FOREACH (uselessVar IN CASE WHEN line.Second IS NOT NULL AND line.Relationship IS NOT NULL AND line.Direction = "Yes" THEN [1] ELSE [] END |
    //     MERGE (src: line[0] { name: line[1] })
    //     MERGE (dest: line[2] { name: line[3] })
    //     MERGE (src)-[r:${line.Relationship}]->(dest)
    //   )
    //   FOREACH (uselessVar IN CASE WHEN line.Second IS NOT NULL AND line.Relationship IS NOT NULL AND line.Direction  = "Bi" THEN [1] ELSE [] END |
    //     MERGE (src: NODE { name: line.First })
    //     MERGE (dest: NODE { name: line.Second })
    //     MERGE (src)-[:${line.Relationship}]->(dest)
    //     MERGE (src)<-[:${line.Relationship}]-(dest)
    //   )
    //   FOREACH (uselessVar IN CASE WHEN line.Second IS NOT NULL AND line.Relationship IS NOT NULL AND line.Direction IS NULL THEN [1] ELSE [] END |
    //     MERGE (src: NODE { name: line.First })
    //     MERGE (dest: NODE { name: line.Second })
    //     MERGE (src)-[:${line.Relationship}]-(dest)
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
