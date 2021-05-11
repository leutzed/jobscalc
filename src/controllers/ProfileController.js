const Profile = require("../model/Profile");

module.exports = {
    async index(request, response) {
        response.render("profile", { profile: await Profile.get() })
    },

    async update(request, response) {
        const profile = await Profile.get();

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

        await Profile.update({
            ...profile,
            ...request.body,
            "value-hour": valueHour
        });

        return response.redirect('/profile');

    }
}