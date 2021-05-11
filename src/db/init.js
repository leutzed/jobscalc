const Database = require('./config');

const initDb = {
    //esse async diz que vai ter await dentro do init()    
    async init(){

    const db = await Database();

    await db.exec(`CREATE TABLE profile (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        avatar TEXT,
        monthly_budget INT,
        days_per_week INT,
        hours_per_day INT,
        vacation_per_year INT,
        value_hour INT
    )`);

    await db.exec(`CREATE TABLE jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        daily_hours INT,
        total_hours INT,
        created_at DATETIME
    )`);

    await db.run(`INSERT INTO jobs(
        name,
        daily_hours,
        total_hours
        ) VALUES (
        "Job nome",
        2,
        5
    );`);

    await db.run(`INSERT INTO profile(
        name,
        avatar,
        monthly_budget,
        days_per_week,
        hours_per_day,
        vacation_per_year,
        value_hour
        ) VALUES (
        "Daniel",
        "https://avatars.githubusercontent.com/u/55982817?v=4",
        3000,
        3,
        2,
        1,
        20
    );`);

    await db.close();

    }
}

initDb.init();