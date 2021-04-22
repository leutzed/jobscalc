const express = require("express");
const routes = express.Router();

const views = __dirname + "/views/";

const Profile = {
    data: {
        name: "Daniel",
        avatar: "https://avatars.githubusercontent.com/u/55982817?v=4",
        "monthly-budget": 3000,
        "hours-per-day": 3,
        "days-per-week": 2,
        "vacation-per-year": 3,
        "value-hour": 50
    },
    
    controllers: {
        index(require, response) {
            response.render(views + "profile", { profile: Profile.data })
        },

        update(require, response) {
            // require.body pega os dados -> definir as semanas de um ano -> remover semanas de ferias
            // horas trabalhadas por semana -> total de horas tranalhadas por mes
        }
    }
};

const Job = {
    data: [
        {
            id: 1,
            name: "Nome do job",
            "daily-hours": 2,
            "total-hours": 1,
            created_at: Date.now()
            },
            {
            id: 2,
            name: "Nome do job 2",
            "daily-hours": 3,
            "total-hours": 23,
            created_at: Date.now()
            }
    ],

    controllers: {
        index(request, response){
            //ajustes no job -> calculo do tempo restante
            const updatedJobs = Job.data.map((job) =>{
                const remaining = Job.services.remainingDays(job);
                const status = remaining <= 0 ? 'done' : 'progress'
        
                return {
                    ...job,
                    remaining,
                    status,
                    budget: Profile.data["value-hour"] * job["total-hours"]
                };
            })
            return response.render(views + "index", { jobs: updatedJobs });
        },

        create(request, response){
            return response.render(views + "job");
        },

        save(request, response){
            const lastJobId = Job.data[Job.data.length - 1]?.id || 1;
    
            Job.data.push({
                id: lastJobId + 1,
                name: request.body.name,
                "daily-hours": request.body["daily-hours"],
                "total-hours": request.body["total-hours"],
                created_at: Date.now()
    });

    return response.redirect('/');
        },
    },

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
        }
    },
}


// request e response
routes.get('/', Job.controllers.index);
routes.get('/job', Job.controllers.create);
routes.post('/job', Job.controllers.save);
routes.get('/job/edit', (request, response)  => response.render(views + "job-edit"));
routes.get('/profile', Profile.controllers.index);
routes.post('/profile', Profile.controllers.update);

module.exports = routes;