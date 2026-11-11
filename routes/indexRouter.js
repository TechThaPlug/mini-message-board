const { Router } = require("express");
const { randomUUID } = require("node:crypto");

const indexRouter = Router();

const MAX_USER_LENGTH = 40;
const MAX_TEXT_LENGTH = 280;

const messages = [
  {
    id: randomUUID(),
    text: "Hi there!",
    user: "Amando",
    added: new Date(),
  },
  {
    id: randomUUID(),
    text: "Hello World!",
    user: "Charles",
    added: new Date(),
  },
];

indexRouter.get("/", (req, res) => {
  res.render("index", { title: "Mini Messageboard", messages });
});

indexRouter.get("/new", (req, res) => {
  res.render("form", {
    title: "New message",
    errors: [],
    values: { messageUser: "", messageText: "" },
  });
});

indexRouter.post("/new", (req, res) => {
  // Express 5 leaves req.body undefined when nothing was parsed
  const { messageUser = "", messageText = "" } = req.body ?? {};

  const user = String(messageUser).trim();
  const text = String(messageText).trim();
  const errors = [];

  if (!user) {
    errors.push("Please enter your name.");
  } else if (user.length > MAX_USER_LENGTH) {
    errors.push(
      "Your name must be " + MAX_USER_LENGTH + " characters or fewer.",
    );
  }

  if (!text) {
    errors.push("Please write a message.");
  } else if (text.length > MAX_TEXT_LENGTH) {
    errors.push(
      "Your message must be " + MAX_TEXT_LENGTH + " characters or fewer.",
    );
  }

  if (errors.length > 0) {
    return res.status(400).render("form", {
      title: "New message",
      errors,
      values: { messageUser: user, messageText: text },
    });
  }

  messages.push({ id: randomUUID(), text, user, added: new Date() });
  res.redirect("/");
});

indexRouter.get("/message/:id", (req, res) => {
  const message = messages.find((item) => item.id === req.params.id);

  if (!message) {
    return res.status(404).render("404", { title: "Message not found" });
  }

  res.render("message", { title: "Message details", message });
});

module.exports = indexRouter;
