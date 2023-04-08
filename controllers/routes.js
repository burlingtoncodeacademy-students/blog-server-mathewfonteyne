const router = require("express").Router();
const db = require("../api/blog.json");
const fs = require("fs");

// GET ALL ROUTE
router.get("/", (req, res) => {
  try {
    res.status(200).json({
      results: db,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// GET BY ID
router.get("/:id", (req, res) => {
  try {
    const id = req.params.id;
    let entry = db.filter((obj) => obj.id == id);

    res.status(200).json({
      status: `Found entry at ID: ${id}`,
      entry,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// CREATE NEW ENTRY
router.post("/create", (req, res) => {
  try {
    let { title, author, body } = req.body;
    let newId = db.length + 1;

    // New Entry Object
    const newEntry = {
      id: newId,
      title,
      author,
      body,
    };
    fs.readFile("./api/blog.json", (err, data) => {
      if (err) throw err;
      const db = JSON.parse(data);
      let currentIDs = [];

      db.forEach((obj) => {
        currentIDs.push(obj.id);
      });

      if (currentIDs.includes(newId)) {
        let maxValue = Math.max(...currentIDs);
        newId = maxValue + 1;
        newCharacter.id = newId;
      }

      db.push(newEntry);
      fs.writeFile("./api/blog.json", JSON.stringify(db), (err) =>
        console.log(err)
      );
      res.status(200).json({
        status: "New Entry added to DB!",
        newEntry,
      });
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// UPDATE EXISTING ENTRY
router.put("/:id", (req, res) => {
  try {
    const id = Number(req.params.id);

    const updatedEntry = req.body;

    fs.readFile("./api/blog.json", (err, data) => {
      if (err) throw err;

      const db = JSON.parse(data);

      let entry;

      db.forEach((obj, i) => {
        if (obj.id === id) {
          let buildObj = {};

          for (key in obj) {
            if (updatedEntry[key]) {
              console.log("Checked!");

              buildObj[key] = updatedEntry[key];
            } else {
              buildObj[key] = obj[key];
            }
          }
          db[i] = buildObj;
          entry = buildObj;
        }
      });
      if (Object.keys(entry).length <= 0)
        res.status(404).json({ message: "No entry found!" });

      fs.writeFile("./api/blog.json", JSON.stringify(db), (err) =>
        console.log(err)
      );

      res.status(200).json({
        status: `Modified entry at ID: ${id}.`,
        entry: entry,
      });
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// DELETE METHOD
router.delete("/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    fs.readFile("./api/blog.json", (err, data) => {
      if (err) throw err;
      const db = JSON.parse(data);

      const filteredDB = db.filter((i) => i.id !== id);

      fs.writeFile("./api/blog.json", JSON.stringify(filteredDB), (err) =>
        console.log(err)
      );

      res.status(200).json({
        status: `Entry at ID: ${id} was successfully deleted.`,
      });
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});
module.exports = router;
