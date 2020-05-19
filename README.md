# frontend

> SEARCCH Hub

The SEARCCH hub is a collaborative, community-driven platform that lowers the barrier to sharing by aiding researchers in packaging, importing, locating, understanding, and reusing experiment artifacts. The artifacts organized by the hub, including tools, methodologies, documentation, and data, can be deployed to community testbeds for performing new experiments.


## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## Using docker-compose

Run `docker-compose up -d` to build and start the application. The docker-compose config is configured to listen on port 3000

To rebuild the application and serve it using docker-compose again use `docker-compose up --build -d` because once the container is built and is in local registry, docker-compose doesn't attempt to build it again unless manually specified
