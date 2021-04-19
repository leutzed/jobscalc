const express = require("express");
const routes = express.Router();

const views = __dirname + "/views/"

const profile = {
    name: "Daniel",
    avatar: "https://avatars.githubusercontent.com/u/55982817?v=4",
    "monthly-budget": 3000,
    "hours-per-day": 3,
    "days-per-week": 2,
    "vacation-per-year": 3
}

// request e response
routes.get('/', (request, response)  => response.render(views + "index"));
routes.get('/job', (request, response)  => response.render(views + "job"));
routes.get('/job/edit', (request, response)  => response.render(views + "job-edit"));
routes.get('/profile', (request, response)  => response.render(views + "profile", { profile }));

module.exports = routes;