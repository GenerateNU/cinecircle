# backend.Dockerfile
FROM node:22-alpine

WORKDIR /app

COPY ./package*.json ./
RUN npm install

COPY . .

EXPOSE 3001
RUN npx prisma generate

# For development, we'll use the dev command from docker-compose
# For production, uncomment the build and start commands below:
# RUN npm run build
# CMD ["npm", "start"]

# Development command (overridden in docker-compose.yml)
CMD ["npm", "run", "dev"]
