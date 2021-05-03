const Job = require("../model/Job");
const Profile = require("../model/Profile");
const JobUtils = require("../utils/jobUtils");

module.exports = {
    index(request, response){
        const jobs = Job.get();
        const profile = Profile.get();

        let statusCount = {
            progress: 0,
            done: 0,
            total: jobs.length
        };

        // total de horas por dia de cada job em progresso
        let jobTotalHours = 0;

        //ajustes no job -> calculo do tempo restante. map olha item a item
        const updatedJobs = jobs.map((job) => {
            const remaining = JobUtils.remainingDays(job);
            const status = remaining <= 0 ? 'done' : 'progress';

            // somando quantidade de status -> ele pega o nome da chave do status e soma 1
            statusCount[status] += 1;

            // se o status for progress, soma com as horas diarias, se não, só retorna sem fazer nada
            jobTotalHours = status == 'progress' ? jobTotalHours += Number(job["daily-hours"]) : jobTotalHours;

            return {
                ...job,
                remaining,
                status,
                budget: JobUtils.calculateBudget(job, profile["value-hour"])
            };
        })

        // qtd de horas que quero trabalhar MENOS qtd de horas/dia em cada job, e statusCount == progress
        const freeHours = profile["hours-per-day"] - jobTotalHours;

        return response.render("index", { jobs: updatedJobs, profile: profile, statusCount: statusCount, freeHours: freeHours });
    }
}