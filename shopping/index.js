const express = express();
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World from shopping!');
}
);

app.listen(8002, () => console.log('Listening on port 8002...'));