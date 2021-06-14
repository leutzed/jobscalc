import express from 'express';
import routes from './routes';
import path from 'path';

class App {
    constructor() {
        this.server = express();

        this.middlewares();
        this.routes();
        this.view();
    }

    middlewares() {
        this.server.use(express.json());
        this.server.use(express.static("public"));
        this.server.use(express.urlencoded({ extended: true }));
    }

    routes() {
        this.server.use(routes);
    }

    view() {
        this.server.set('view engine', 'ejs');
        this.server.set('views', path.join(__dirname, 'views'));
    }
}

export default new App().server;