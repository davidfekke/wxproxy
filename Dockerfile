FROM node:24-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Install production deps using lockfile
COPY package.json ./
RUN pnpm install --prod

# Copy app source
COPY . .

EXPOSE 8000
CMD [ "pnpm", "start" ]
