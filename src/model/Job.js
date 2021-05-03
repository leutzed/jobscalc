let data = [
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
    "daily-hours": 12,
    "total-hours": 21,
    created_at: Date.now(),
    }
];

module.exports = {
    get(){
        return data;
    },
    update(newData){
        data = newData;
    },
    delete(id){
        // filter pega todos aqueles e vai tirar do meu retorno
        data = data.filter(job => Number(job.id) !== Number(id))
    }
}