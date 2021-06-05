import express from 'express';
import routes from './routes';
import path from 'path';

class App {
    constructor() {
        this.server = express();

        this.server.set('view engine', 'ejs');
        this.server.set('views', path.join(__dirname, 'views'));
        this.server.use(express.static("public"));
        this.server.use(express.urlencoded({ extended: true }));
    }

    middlewares() {
        this.server.use(express.json());
    }

    routes() {
        this.server.use(routes);
    }
}

export default new App().server;