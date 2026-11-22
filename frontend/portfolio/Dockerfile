FROM node:24-alpine AS dev

RUN apk update && npm install -g @angular/cli

WORKDIR /app

COPY package*.json ./

RUN npm install



# build app for production

FROM dev AS build

COPY . .

EXPOSE 4200

RUN ng build --configuration production --source-map --base-href /



# production (copy app from build)

FROM nginx:alpine

# install tzdata to use TZ environment variable
RUN apk add --no-cache tzdata

RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist/portfolio /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]