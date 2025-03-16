const autocannon = require('autocannon');

const servers = [
    { name: 'Express', url: 'http://localhost:3000' },
    { name: 'Fastify', url: 'http://localhost:3001' }
];

const processPayload = JSON.stringify({
    name: 'Test',
    templateValues: Array.from({ length: 1000 }, () => Math.floor(Math.random() * 1000))
});

async function runBenchmark(server, route, method, payload = null) {
    console.log(` ==== ${server.name} - ${route} ====`);

    const result = await autocannon({
        url: server.url + route,
        method: method,
        body: payload,
        headers: { 'Content-Type': 'application/json' },
        connections: method === 'GET' ? 500 : 100,
        duration: 10
    });

    console.log(`\n Results (${server.name} - ${route}):\n`);
    console.log(autocannon.printResult(result));
}

(async () => {
    for (const server of servers) {
        await runBenchmark(server, '/ping', 'GET');
        await runBenchmark(server, '/process', 'POST', processPayload);
    }
})();
