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

Using docker-compose will allow you to use a yaml file as a configuration for building the searcch frontend without needing to remember various stop/start and container remove steps. Additionally, the provided starter docker-compose file will automatically build the image and tag it if there are changes to the code repo. This will allow the service to always be using the latest code base.

### Starting and stopping

#### Starting

Generally, when running searcch frontend with docker compose, you will use some form of `docker-compose --project-name searcch-frontend up -d`. If the docker image named `search-frontend-production` or `searcch-frontend-development` do not exist, they will be build automatically. If they do exist, they will use the latest image of those by default. If you want to force a rebuild of the image, you will need to use the `--build` flag in your docker-compose command.

To work with just prod or dev, append `prod` or `dev` to the end of the docker-compose line above

Example: `docker-compose --project-name searcch-frontend up -d prod` will start just the production container. To force a rebuild of the image first, run `docker-compose --project-name searcch-frontend up --build -d prod`

#### Stopping

To stop containers, use the `down` command with docker-compose.

Example: `docker-compose --project-name searcch-frontend down prod` will stop the production container

### Setting environment variables

searcch-frontend requires various environment variables to be set in a prod-variables.env and dev-variables.env file. You can use the .env file in the searcch repo as a sample starting point and add the proper prod and dev environment information.

### Using github API key to build the docker image

Running docker-compose with a github API key allows you to always build from the remote github repo. This allows you to:
* always have what is in the online source for the searcch front end.
* specify branches at the end of the branch. For example: replace dev-branch in searcch-frontend build: line with the branch you want to use.
* avoid having the repo pulled locally. If using the api key, you only need the docker-compose.yml file and .env files related to it.

To use the github API key, replace `githubapitoken` with your api token for the searcch project in github

### Using a local to build the docker image

Running docker-compose with locally sourced files allows you to build the docker images from the local repo you cloned from docker. This is helful if you do not have a github API key for the SEARCCH project.
Replace the `build: ${TOKEN...` line with `build: .`

Using the local repo allows you to:
* run the services if you don't have github API key
* run the service in an offline test system
* quick check changes made to code on a separate test system without committing and pushing up to github

