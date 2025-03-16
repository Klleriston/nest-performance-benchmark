#!/bin/sh

cd /app/nest-default && node dist/main.js &
EXPRESS_PID=$!
echo "Started Express server (PID: $EXPRESS_PID)"

cd /app/nest-fastify && node dist/main.js &
FASTIFY_PID=$!
echo "Started Fastify server (PID: $FASTIFY_PID)"

echo "Waiting for servers to initialize (5s)..."
sleep 5

cd /app/load-test
node benchmark.js

BENCHMARK_EXIT=$?

kill $EXPRESS_PID $FASTIFY_PID

exit $BENCHMARK_EXIT