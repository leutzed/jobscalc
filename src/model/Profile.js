let data = {
    name: "Daniel",
    avatar: "https://avatars.githubusercontent.com/u/55982817?v=4",
    "monthly-budget": 3000,
    "hours-per-day": 3,
    "days-per-week": 2,
    "vacation-per-year": 3,
    "value-hour": 50
};

module.exports = {
    get(){
        return data;
    },
    update(newData){
        data = newData;
    }
}