import * as dotenv from 'dotenv';

import App from './app';

dotenv.config({path: __dirname + '/.env'});

const {PORT} = process.env;
const app = new App();

app.initMiddlewares();
app.initControllers();
app.listen(PORT || '3000');
