# Common build stage
FROM node:14.14.0 as common-build-stage

COPY ./ ./app

WORKDIR /app

RUN npm install

EXPOSE 3000

ENV NODE_ENV production

CMD ["npm", "run", "start"]
