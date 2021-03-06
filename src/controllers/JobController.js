const Job = require("../model/Job");
const Profile = require("../model/Profile");
const JobUtils = require("../utils/jobUtils");

module.exports = {
    create(request, response){
        return response.render("job");
    },

    async save(request, response){
        await Job.create({
            name: request.body.name,
            "daily-hours": request.body["daily-hours"],
            "total-hours": request.body["total-hours"],
            created_at: Date.now()
    });

    return response.redirect('/');

    },

    async show(request, response){
        const jobs = await Job.get();
        const profile = await Profile.get();

        // pega o id da url - esse "id" precisa ser o mesmo nome da rota ex: routes.get('/job/:id', Job.controllers.show);
        const jobId = request.params.id

        // o find procura dentro de jobs->Job.get um "job" (nome que coloquei agora) - o id, e vai me retornar true, se o id achado for igual ao da url que é jobId
        const job = jobs.find(job => Number(job.id) === Number(jobId));

        if (!job){
            return response.redirect('/job')
        }

        job.budget = JobUtils.calculateBudget(job, profile["value-hour"])

        return response.render("job-edit", { job })
    },

    async update(request, response){
        // pega o id da url - esse "id" precisa ser o mesmo nome da rota ex: routes.get('/job/:id', Job.controllers.show);
        const jobId = request.params.id;

        const updatedJob = {
            // esta sendo sobreescrito naquilo que já veio preenchido
            name: request.body.name,
            "total-hours": request.body["total-hours"],
            "daily-hours": request.body["daily-hours"]
        }

        await Job.update(updatedJob, jobId);

        response.redirect('/job/' + jobId);
    },

    async delete(request, response){
        const jobId = request.params.id;

        await Job.delete(jobId);

        return response.redirect('/')
    }
}