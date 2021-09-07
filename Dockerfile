# syntax=docker/dockerfile:1

FROM node:14.16.0
ENV NODE_ENV=production
WORKDIR /app
COPY ["server/package.json", "server/package-lock.json", "./"]
RUN server; npm install --production
RUN server; npm install request-ip
RUN server; npm install ejs
COPY . .
CMD ["node", "server/server.js"]