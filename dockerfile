# dev: Runs a container in dev mode w/o nginx

#FROM node:12
#WORKDIR /usr/src/app
#COPY package*.json ./
#RUN yarn
#COPY . .
#EXPOSE 3000
#CMD [ "yarn", "start" ]

# production: yarn build, move build to nginx static html folder, start nginx

FROM node:12 as build-deps
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn
COPY . ./
RUN yarn build

FROM nginx:1.12-alpine
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
