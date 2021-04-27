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
        index(request, response) {
            response.render(views + "profile", { profile: Profile.data })
        },

        update(request, response) {
            // request.body pega os dados ->  
            const data = request.body;

            // definir as semanas de um ano            
            const weeksPerYear = 52;

            // remover semanas de ferias
            const weeksPerMonth = (weeksPerYear - data["vacation-per-year"]) / 12;

            // horas trabalhadas por semana
            const weeksTotalHours = data["hours-per-day"] * data["days-per-week"];

            // total de horas tranalhadas por mes
            const monthlyTotalHours = weeksTotalHours * weeksPerMonth;

            // qual o valor da minha hora
            const valueHour = data["monthly-budget"] / monthlyTotalHours;

            Profile.data = {
                ...Profile.data,
                ...request.body,
                "value-hour": valueHour
            };

            return response.redirect('/profile');

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
            created_at: Date.now(),
            },
            {
            id: 2,
            name: "Nome do job 2",
            "daily-hours": 3,
            "total-hours": 23,
            created_at: Date.now(),
            }
    ],

    controllers: {
        index(request, response){
            //ajustes no job -> calculo do tempo restante
            const updatedJobs = Job.data.map((job) => {
                const remaining = Job.services.remainingDays(job);
                const status = remaining <= 0 ? 'done' : 'progress'
        
                return {
                    ...job,
                    remaining,
                    status,
                    budget: Job.services.calculateBudget(job, Profile.data["value-hour"])
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

        show(request, response){
            // pega o id da url - esse "id" precisa ser o mesmo nome da rota ex: routes.get('/job/:id', Job.controllers.show);
            const jobId = request.params.id

            // o find procura dentro de Job.data um "job" (nome que coloquei agora) - o id, e vai me retornar true, se o id achado for igual ao da url que é jobId
            const job = Job.data.find(job => Number(job.id) === Number(jobId));

            if (!job){
                return response.redirect('/job')
            }

            job.budget = Job.services.calculateBudget(job, Profile.data["value-hour"])

            return response.render(views + "job-edit", { job })
        },

        update(request, response){
            // pega o id da url - esse "id" precisa ser o mesmo nome da rota ex: routes.get('/job/:id', Job.controllers.show);
            const jobId = request.params.id

            // o find procura dentro de Job.data um "job" (nome que coloquei agora) - o id, e vai me retornar true, se o id achado for igual ao da url que é jobId
            const job = Job.data.find(job => Number(job.id) === Number(jobId));

            if (!job){
                return response.redirect('/job')
            }

            const updatedJob = {
                ...job,
                name: request.body.name,
                "total-hours": request.body["total-hours"],
                "daily-hours": request.body["daily-hours"]
            }
        }
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
routes.get('/profile', Profile.controllers.index);
routes.post('/profile', Profile.controllers.update);

module.exports = routes;