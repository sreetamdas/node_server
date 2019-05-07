module.exports = function(app, db) {
	app.post("/notes", (req, res) => {
		// You'll create your note here.
		console.log(req.body);
		res.send("Hello");
	});
	app.get("/get_this", (req, res) => {
		console.log(req.body);
		res.send("Hello! This is a GET request");
	});
	app.post("/user_add", (req, res) => {
		console.log(req);
		res.send("Status: 200");
	});
};
