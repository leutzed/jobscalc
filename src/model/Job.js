const Database = require('../db/config');

module.exports = {
    async get(){
        const db = await Database();

        const jobs = await db.all(`SELECT * FROM jobs`);

        await db.close();
        
        return jobs.map(job => ({
            id: job.id,
            name: job.name,
            "daily-hours": job.daily_hours,
            "total-hours": job.total_hours,
            created_at: Date.now()
        }));
    },
    update(newData){
        data = newData;
    },
    delete(id){
        // filter pega todos aqueles e vai tirar do meu retorno
        data = data.filter(job => Number(job.id) !== Number(id));
    },
    async create(newData){
        const db = await Database();

        await db.run(`INSERT INTO jobs (
            name,
            daily_hours,
            total_hours,
            created_at
        ) VALUES (
            "${newData.name}",
            ${newData['daily-hours']},
            ${newData["total-hours"]},
            ${newData.created_at}
        )`);

        await db.close();


    }
}