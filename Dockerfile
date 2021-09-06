# syntax=docker/dockerfile:1

FROM node:14.16.0
ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json", "package-lock.json", "./"]
RUN npm install --production
RUN npm install request-ip
RUN npm install ejs
COPY . .
CMD ["node", "server.js"]
EXPOSE 8000