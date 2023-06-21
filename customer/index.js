const express = express();
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World from Customer!');
}
);

app.listen(8000, () => console.log('Listening on port 8000...'));