const express = require("express");
const routes = express.Router();
const ProfileController = require("./controllers/ProfileController");


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
            return response.render("index", { jobs: updatedJobs });
        },

        create(request, response){
            return response.render("job");
        },

        save(request, response){
            const lastJobId = Job.data[Job.data.length - 1]?.id || 0;
    
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

            return response.render("job-edit", { job })
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
                // espalhei o job, ou seja, trouxe todos os dados dos job
                ...job,
                // o que vem depois do job, esta sendo sobreescrito naquilo que já veio preenchido
                name: request.body.name,
                "total-hours": request.body["total-hours"],
                "daily-hours": request.body["daily-hours"]
            }

            Job.data = Job.data.map(job => {
                if(Number(job.id) === Number(jobId)) {
                    job = updatedJob;
                }
                return job;
            })
            response.redirect('/job/' + jobId);
        },

        delete(request, response){
            const jobId = request.params.id;

            // filter pega todos aqueles e vai tirar do meu retorno
            Job.data = Job.data.filter(job => Number(job.id) !== Number(jobId))

            return response.redirect('/')
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
routes.post('/job/delete/:id', Job.controllers.delete);
routes.get('/profile', ProfileController.index);
routes.post('/profile', ProfileController.update);

module.exports = routes;