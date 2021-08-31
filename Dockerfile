FROM node:14.17.4

# create a directory for the application
RUN mkdir /app

# set the above directory as working directory for the process
WORKDIR /app

# copy everything from the pwd on host to the docker container
# ignoring what is in .dockerignore
COPY . /app

# install the application
RUN npm install

# build the server and other required stuff
RUN npm run build

# nuxt server listens on localhost by default
ENV NUXT_HOST=0.0.0.0

# Expose the port 3000 used by nuxt
EXPOSE 3000

CMD ["node", "/app/node_modules/.bin/nuxt", "start"]
