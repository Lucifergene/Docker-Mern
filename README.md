
### MERN / Docker

# Dockerizing a MERN Stack Web Application

### Using Docker Containers to build Web Application

![Image Source: [Google Images](https://sujaykundu.com/building-mern-apps-using-docker)](https://cdn-images-1.medium.com/max/2000/1*JJFt8gRBPBCjSwNYqhP3UA.png)

The MERN stack is becoming increasingly popular and could be a powerful stack to figure in. Therefore having the ability to build and deploy good MERN applications, greatly helps career prospects as a developer.

## What is the MERN Stack?

The MERN stack is a JavaScript stack that is designed to make the development process smoother. MERN includes four open-source components: MongoDB, Express, React, and Node.js. These components offer an associate end-to-end framework for developers to work in.

## A Closer Look at MERN Stack Components

### MongoDB: A cross-platform document database

[MongoDB](https://www.mongodb.com/) is a NoSQL (non-relational) document-oriented database. Data is stored in flexible documents with a JSON (JavaScript Object Notation)-based query language. MongoDB is known for being flexible and easy to scale.

### Express: A back-end web application framework

[Express](https://expressjs.com/) is a web application framework for Node.js, another MERN component. Instead of writing full web server code by hand on Node.js directly, developers use Express to simplify the task of writing server code.

### React: A JavaScript library for building user interfaces

[React](https://reactjs.org/) was originally created by a software engineer at Facebook, and was later open-sourced. The React library can be used for creating views rendered in HTML. In a way, it’s the defining feature of the stack.

### Node.js: A cross-platform JavaScript runtime environment

[Node.js](https://nodejs.org/en/) is constructed on Chrome’s V8 JavaScript engine. It’s designed to build scalable network applications and can execute JavaScript code outside of a browser. For more information, you can refer to the article below:
[**Getting Started with Node JS✌**
*Are you a newbie to Web Development? Want to get started with Node.js? This article is for you. Here, you get to know…*medium.com](https://medium.com/dsckiit/getting-started-with-node-js-89663e4e0e9e)

Before we understand the utility of **Docker**, let’s first learn about **Containers.**

## What is a container?
>  “A container is the standard unit of software that packages up code and all its dependencies so the application runs quickly and reliably from one computing environment to another.”

This tool becomes very useful during the development phase. As many developers are involved in the process, it often becomes a hefty task of setting up the environment to run the project, as each project comes with their list of dependencies along with the specified versions.

A **Docker** container image is a lightweight, standalone, executable package of software that includes everything needed to run an application: code, runtime, system tools, system libraries and settings. **Container images** become **containers** at runtime and in the case of Docker containers — images become containers when they run on [**Docker Engine**](https://www.docker.com/products/container-runtime).

For more information about Docker containers, visit this site:
[**What is a Container? | Docker**
*A container is a standard unit of software that packages up code and all its dependencies so the application runs...* www.docker.com](https://www.docker.com/resources/what-container)

## Docker Hub

Docker Hub is a cloud-based repository service provided by Docker in which users create, test, store and distribute container images. Through Docker Hub, a user can access public, open-source image repositories, as well as use space to create their own private repositories, automated build functions, webhooks and workgroups.
[**Docker Hub**
*Edit description*hub.docker.com](https://hub.docker.com/)

## Getting Started with the Integration

![Integrating the 2 Technologies](https://cdn-images-1.medium.com/max/2048/1*Wz0qYxhDbGWSGUalcKWuGg.jpeg)

Our main focus in this tutorial is understanding how to integrate Docker with a MERN Stack Application. For explaining this, let’s try to dockerize an E-Commerce Web Application.

You can download the basic E-Commerce Web App from this [Link](https://github.com/mohamedsamara/mern-ecommerce).

## Overview

We are going to Dockerize Node.JS, React, and MongoDB into separate containers. Then we are going to use [**DOCKER COMPOSE**](https://docs.docker.com/compose/) to run the multi-container application.

At last, from a single command, we can create and start all the services from our configuration.

## Initializing the Project

Clone the GitHub link to a local folder in your computer. Open the folder using [VSCode ](https://code.visualstudio.com/download)or any text editor of your choice.

## Docker Files

Now, we need to create a Dockerfile for the server and the client. The **Dockerfile** essentially contains the build instructions to build the image.

Let’s start by creating the Dockerfile for the client (our React Frontend).

 1. In the client folder, create a file called **Dockerfile** without any extension.

 2. Write the following lines of code in the file:

```yml
    # Dockerfile for React client
    
    # Build react client
    FROM node:10.16-alpine
    
    # Working directory be app
    WORKDIR /usr/src/app
    
    COPY package*.json ./
    
    ###  Installing dependencies
    
    RUN npm install --silent
    
    # copy local files to app folder
    COPY . .
    
    EXPOSE 3000
    
    CMD ["npm","start"]
```
We can simply build our Frontend with this command

`docker build -t react-app .`

To verify everything is fine, we run our newly built container using the command:docker run -p 3000:3000 react-app . This will run just the Frontend.

In the same way, we create a file called **Dockerfile** for the Backend Server.

 1. Now, we create a **Dockerfile** for the server directory.

 2. Write the following lines of code in the file:
```yml
 #  Dockerfile for Node Express Backend
    
    FROM node:10.16-alpine
    
    # Create App Directory
    RUN mkdir -p /usr/src/app
    WORKDIR /usr/src/app
    
    # Install Dependencies
    COPY package*.json ./
    
    RUN npm install --silent
    
    # Copy app source code
    COPY . .
    
    # Exports
    EXPOSE 5000
    
    CMD ["npm","start"]
```

We can simply build our Backend with this command:

`docker build -t node-app .`

## Docker Compose
>  “Compose is a tool for defining and running multi-container Docker applications. With Compose, you use a YAML file to configure your application’s services. Then, with a single command, you create and start all the services from your configuration.”

To run our entire application together, i.e run all containers parallelly, we need to configure the **docker-compose file**.

 1. In the main directory of the project, (outside the server/client) create a file named **docker-compose.yml .**

 2. Write these contents into the file.

```yml
    version: '3.7'
    
    services:
      server:
        build:
          context: ./server
          dockerfile: Dockerfile
        image: myapp-server
        container_name: myapp-node-server
        command: /usr/src/app/node_modules/.bin/nodemon server.js
        volumes:
          - ./server/:/usr/src/app
          - /usr/src/app/node_modules
        ports:
          - "5000:5000"
        depends_on:
          - mongo
        env_file: ./server/.env
        environment:
          - NODE_ENV=development
        networks:
          - app-network
      mongo:
        image: mongo
        volumes:
          - data-volume:/data/db
        ports:
          - "27017:27017"
        networks:
          - app-network
      client:
        build:
          context: ./client
          dockerfile: Dockerfile
        image: myapp-client
        container_name: myapp-react-client
        command: npm start
        volumes:
          - ./client/:/usr/app
          - /usr/app/node_modules
        depends_on:
          - server
        ports:
          - "3000:3000"
        networks:
          - app-network
    
    networks:
        app-network:
            driver: bridge
    
    volumes:
        data-volume:
        node_modules:
        web-root:
          driver: local
```
## **Creating the Build**

To create the build for the entire application, we need to run the following command: docker-compose build

## **Starting the Services**

We can start the multi-container system using the following simple command: `docker-compose up`

At last, we can open `http://localhost:3000` to see our React Frontend.

The backend server is live on `http://localhost:5000`

And MongoDB is running on `http://localhost:27017`

## Maintenance & Inspection

We can inspect running services using the docker-compose ps command.

The docker-compose logs will dump logs of all the running services.

## Stopping the containers

To stop all the services, we use docker-compose stop.

Using `docker-compose down --volumes` brings everything down, removing the containers entirely, with the data volume of the services.

**Finally, we have successfully dockerized our E-Commerce Web app.**

You can find the final GitHub Repo link below:

[**Lucifergene/Docker-Mern**
*Contribute to Lucifergene/Docker-Mern development by creating an account on GitHub.* github.com](https://github.com/Lucifergene/Docker-Mern)

## Official Docs
[**Overview of Docker Compose**
*Looking for Compose file reference? Find the latest version here. Compose is a tool for defining and running…* docs.docker.com](https://docs.docker.com/compose/)

[**Empowering App Development for Developers | Docker**
*A 1-day digital event on May 28th featuring sessions from Docker experts and the broader container community, a live…* www.docker.com](https://www.docker.com/)

You can reach out on my [Twitter](https://twitter.com/avik6028), [Instagram](https://instagram.com/avik6028) or on [LinkedIn](https://linkedin.com/in/avik-kundu-0b837715b) if you need more help. I would be more than happy.

**Good Luck** 😎 and **happy coding** 👨‍💻



