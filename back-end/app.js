require("express-async-errors");

const express = require("express");
const cors = require("cors");

const teamRouter = require("./routes/team-router");
const writeFromCSVToDB = require("./util/csv-helper");

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.static("./public"));
app.use("/api/v1", teamRouter);

const start = async () => {
  try {
    
    // Notice that we don't use await, we instead make use of event listeners. 
    // The sqlite3 package used doesn't support async/await
    const csvDB = await writeFromCSVToDB();
    csvDB.on("close", () => app.listen(port, () => console.log(`App is listening on port#: ${port}`)));

  } catch (err) { console.log("An error occured: " + err); }
}

start();
