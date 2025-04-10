FROM node:20

WORKDIR /app

RUN npm install -g @nestjs/cli

COPY . /app

EXPOSE 3000

CMD ["npm", "run", "start:docker"]