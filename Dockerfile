FROM node:18-alpine AS base

RUN apk add --no-cache git

FROM base AS load-test-deps
WORKDIR /app/load-test
COPY load-test/package*.json ./
RUN npm install

FROM base AS express-deps
WORKDIR /app/nest-default
COPY nest-default/package*.json ./
RUN npm install

FROM base AS fastify-deps
WORKDIR /app/nest-fastify
COPY nest-fastify/package*.json ./
RUN npm install

FROM express-deps AS express-build
WORKDIR /app/nest-default
COPY nest-default/ ./
RUN npm run build

FROM fastify-deps AS fastify-build
WORKDIR /app/nest-fastify
COPY nest-fastify/ ./
RUN npm run build

FROM base AS final
WORKDIR /app

COPY --from=load-test-deps /app/load-test/node_modules /app/load-test/node_modules
COPY load-test /app/load-test

COPY --from=express-deps /app/nest-default/node_modules /app/nest-default/node_modules
COPY --from=express-build /app/nest-default/dist /app/nest-default/dist
COPY nest-default/package*.json /app/nest-default/

COPY --from=fastify-deps /app/nest-fastify/node_modules /app/nest-fastify/node_modules
COPY --from=fastify-build /app/nest-fastify/dist /app/nest-fastify/dist
COPY nest-fastify/package*.json /app/nest-fastify/

COPY run-benchmark.sh /app/
RUN chmod +x run-benchmark.sh

CMD ["/bin/sh", "/app/run-benchmark.sh"]