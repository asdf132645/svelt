ARG PATH_NAME="/account"

FROM node:18-slim AS builder
WORKDIR /tmp/workspace

ARG PATH_NAME
ENV BASE_PATH="${PATH_NAME}"

ADD . .
RUN yarn install
RUN yarn build

FROM node:18-slim as deploy
WORKDIR /tmp/workspace
COPY --from=builder /tmp/workspace/build ./build
COPY --from=builder /tmp/workspace/static ./static
COPY --from=builder \
  /tmp/workspace/package.json \
  /tmp/workspace/.env \
  ./

RUN yarn install --production

FROM node:18-alpine AS runner
WORKDIR /var/run/sugarbricks
ARG PATH_NAME
ENV BASE_PATH="${PATH_NAME}"
ENV NODE_ENV production

ENV PUBLIC_DOMAIN=""
ENV VITE_API_HOST=""

ENV HOST 0.0.0.0
ENV PORT 3000

COPY --from=deploy /tmp/workspace/ ./

EXPOSE 3000

CMD ["node", "build"]
