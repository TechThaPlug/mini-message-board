const path = require("node:path");
const express = require("express");
const indexRouter = require("./routes/indexRouter");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Available in every template
app.locals.formatDate = (date) =>
  date.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);

// Last on purpose: runs only when no route above matched
app.use((req, res) => {
  res.status(404).render("404", { title: "Page not found" });
});

// Four parameters tell Express this is an error handler
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).send("Something went wrong.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Mini message board - listening on port ${PORT}!`);
});
