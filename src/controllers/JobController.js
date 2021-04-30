const Job = require("../model/Job");

module.exports = {
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
}