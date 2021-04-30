let data = {
    id: 1,
    name: "Nome do job",
    "daily-hours": 2,
    "total-hours": 1,
    created_at: Date.now(),
}

module.exports = {
    get(){
        return data;
    },
    update(newData){
        data = newData
    }
}