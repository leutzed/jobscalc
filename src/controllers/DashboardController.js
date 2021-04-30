const Job = require("../model/Job");
const Profile = require("../model/Profile");
const JobUtils = require("../utils/jobUtils");

module.exports = {
    index(request, response){
        const jobs = Job.get();
        const profile = Profile.get();

        //ajustes no job -> calculo do tempo restante
        const updatedJobs = jobs.map((job) => {
            const remaining = JobUtils.remainingDays(job);
            const status = remaining <= 0 ? 'done' : 'progress'
    
            return {
                ...job,
                remaining,
                status,
                budget: JobUtils.calculateBudget(job, profile["value-hour"])
            };
        })
        return response.render("index", { jobs: updatedJobs });
    }
}