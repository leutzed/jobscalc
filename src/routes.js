const express = require("express");
const routes = express.Router();

const views = __dirname + "/views/";

const profile = {
    name: "Daniel",
    avatar: "https://avatars.githubusercontent.com/u/55982817?v=4",
    "monthly-budget": 3000,
    "hours-per-day": 3,
    "days-per-week": 2,
    "vacation-per-year": 3
};

const jobs = [
    {
    id: 1,
    name: "Nome do job",
    "daily-hours": 2,
    "total-hours": 10,
    created_at: Date.now()
    },
    {
    id: 2,
    name: "Nome do job 2",
    "daily-hours": 3,
    "total-hours": 23,
    created_at: Date.now()
    }
];

// request e response
routes.get('/', (request, response)  => {
    //ajustes no job -> calculo do tempo restante
    const updatedJobs = jobs.map((job) =>{

        const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed(); // toFixed arredonda o numero para numero sem virgula
        
        const createdDate = new Date(job.created_at);
        const dueDay = createdDate.getDate() + Number(remainingDays);


        return job;
    })



    return response.render(views + "index", { jobs })
});
routes.get('/job', (request, response)  => response.render(views + "job"));
routes.post('/job', (request, response)  => {
    //request.body { name: 'daniel', ..........}
    const lastJobId = jobs[jobs.length - 1]?.id || 1;
    
    jobs.push({
        id: lastJobId + 1,
        name: req.body.name,
        "daily-hours": req.body["daily-hours"],
        "total-hours": req.body["total-hours"],
        created_at: Date.now()
    });

    return response.redirect('/');
});
routes.get('/job/edit', (request, response)  => response.render(views + "job-edit"));
routes.get('/profile', (request, response)  => response.render(views + "profile", { profile }));

module.exports = routes;