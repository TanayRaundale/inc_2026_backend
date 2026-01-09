# FROM node:18.14.2-alpine3.17 AS base

# WORKDIR /usr/src/app

# COPY package*.json .

# FROM base AS dev

# RUN --mount=type=cache,target=/usr/src/app/.npm \
#   npm set cache /usr/src/app/.npm && \
#   npm install

# COPY . .

# CMD ["npm", "run", "dev"]

FROM base AS production

ENV NODE_ENV=production

RUN --mount=type=cache,target=/usr/src/app/.npm \
  npm set cache /usr/src/app/.npm && \
  npm ci --only=production

# ✅ CREATE + OWN DIRECTORY AS ROOT
RUN mkdir -p /usr/src/app/uploads/tmp \
    && chown -R node:node /usr/src/app/uploads

# ✅ NOW DROP PRIVILEGES
USER node

COPY --chown=node:node . .

EXPOSE 3001

CMD ["node", "index.js"]


