const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode.js");
const forecast = require("./utils/forecast.js");

const app = express();

// define paths for express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// setup handlebars engine and views location and partials path
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// setup static directory to serve
app.use(express.static(publicDirectoryPath));

// hbs home page
app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Aryan Choudhary",
  });
});

// hbs about page
app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Aryan Choudhary",
  });
});

// hbs help page
app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    name: "Aryan Choudhary",
    example: "This is an example.",
  });
});

// weather page
app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address",
    });
  }

  const address = req.query.address;
  geocode(address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({
        error,
      });
    }

    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send({
          error,
        });
      }

      res.send({
        location,
        forecast: forecastData,
      });
    });
  });
});

// hbs help 404 page
app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Aryan Choudhary",
    info: "Help article not found!",
  });
});

// hbs 404 page
app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Aryan Choudhary",
    info: "Page not found!",
  });
});

// starts a server with port 3000
app.listen(3000, () => {
  console.log("Server is up on port 3000.");
});