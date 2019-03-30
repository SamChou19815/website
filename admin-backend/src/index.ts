import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/api/hello-world', (_, resp) => resp.status(200).send('Hello World!'));

const PORT = process.env.PORT || '8080';
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
