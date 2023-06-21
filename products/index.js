const express = express();
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World from Products!');
}
);

app.listen(8001, () => console.log('Listening on port 8001...'));