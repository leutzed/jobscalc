const express = require("express");
const routes = express.Router();
const ProfileController = require("./controllers/ProfileController");


    services: {
        remainingDays(job) {
            const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed(); // toFixed arredonda o numero para numero sem virgula
                
            const createdDate = new Date(job.created_at);
            const dueDay = createdDate.getDate() + Number(remainingDays);
            const dueDate = createdDate.setDate(dueDay);
        
            const timeDiffInMs = dueDate - Date.now();
            // milissengundos em dias
            const dayInMs = 1000 * 60 * 60 * 24;
            const dayDiff = Math.floor(timeDiffInMs / dayInMs);
        
            return dayDiff;
        },
        
        calculateBudget: (job, valueHour) => valueHour * job["total-hours"]
    },
}


// request e response
routes.get('/', Job.controllers.index);
routes.get('/job', Job.controllers.create);
routes.post('/job', Job.controllers.save);
routes.get('/job/:id', Job.controllers.show);
routes.post('/job/:id', Job.controllers.update);
routes.post('/job/delete/:id', Job.controllers.delete);
routes.get('/profile', ProfileController.index);
routes.post('/profile', ProfileController.update);

module.exports = routes;