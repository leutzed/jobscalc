const Profile = require("../model/Profile");

module.exports = {
    index(request, response) {
        response.render("profile", { profile: Profile.get() })
    },

    update(request, response) {
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

        Profile.update({
            ...Profile.get(),
            ...request.body,
            "value-hour": valueHour
        });

        return response.redirect('/profile');

    }
}