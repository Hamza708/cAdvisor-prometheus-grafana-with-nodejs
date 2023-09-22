const express = require('express');
const app = express();
const client = require('prom-client');

let register = new client.Registry();

const headsCount = new client.Counter({
    name: "heads_count",  // Corrected metric name to "heads_count"
    help: "Number of heads"
});

const tailsCount = new client.Counter({
    name: "tails_count",  // Corrected metric name to "tails_count"
    help: "Number of tails"
});

const flipCount = new client.Counter({
    name: "flip_count",   // Corrected metric name to "flip_count"
    help: "Number of flips"
});

register.setDefaultLabels({
    app: 'coin_api'
});

register.registerMetric(tailsCount);
register.registerMetric(headsCount);
register.registerMetric(flipCount);

client.collectDefaultMetrics({ register });

app.get('/', (req, res) => {
    res.send('Welcome!');
});


app.get('/flip-coins', (req, res) => {
    const { times } = req.query;
    if (times && times > 0) {
        flipCount.inc(Number(times));
        let heads = 0;
        let tails = 0;
        for (let i = 0; i < times; i++) {
            let randomNumber = Math.random();
            if (randomNumber < 0.5) {
                heads++;
            } else {
                tails++;
            }
            headsCount.inc(heads);
            tailsCount.inc(tails);
        }
        res.json({ heads, tails });
    } else {
        res.send('hello! I work!!');
    }
});

app.get('/metrics', async (req, res) => {
    res.setHeader('Content-type', register.contentType);
    res.end(await register.metrics());
});

app.listen(7000, () => { console.log("listening on port 7000"); });
