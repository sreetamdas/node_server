module.exports = function(app, db) {

	app.post("/bulk_upload", (req, res) => {
		console.log(req);
		// const file = req.b
		res.send("Status: 200");
	});
};
