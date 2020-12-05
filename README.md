# ![bmg](images/mean.jpeg)

Demonstrate the ability of MEAN Stack to create a simple User Application for CRUD operations.

*Check [mean-github](https://github.com/meanjs/mean) - The Open-Source Full-Stack Solution For MEAN Applications.*

## Introduction

MEAN is a set of Open Source components that together, provide an end-to-end framework for building dynamic web applications; starting from the top (code running in the browser) to the bottom (database). The stack is made up of:

- **M**ongoDB : Document database – used by your back-end application to store its data as JSON (JavaScript Object Notation) documents
- **E**xpress (sometimes referred to as Express.js): Back-end web application framework running on top of Node.js
- **A**ngular (formerly Angular.js): Front-end web app framework; runs your JavaScript code in the user's browser, allowing your application UI to be dynamic
- **N**ode.js : JavaScript runtime environment – lets you implement your application back-end in JavaScript

# ![service-architecture](images/service-architecture.png)

## Getting Started

```
$ git clone https://github.com/amromran102/bmg.git
```

## Run with Docker

The repo contains a docker-compose.yml file, that orchestrates the build of docker images for running the applicatiton.

Install [docker](https://docs.docker.com/get-docker/) and follow the next steps:

#### Verify that Docker is installed
```
$ docker  -v
Docker version 19.03.13, build 4484c46d9d

$ docker-compose -v
docker-compose version 1.27.4, build 40524192
```

#### Build the Application with Docker Compose

Navigate to the project folder and execute docker-compose 
```
$ cd bmg
$ docker-compose up --build
```
As a result of a sucessfull compiling you should see the following in your console:
```
Server has been started at port:3000
...
MongoDB is connected at port 27017
...
** Angular Live Development Server is listening on 0.0.0.0:4200, open your browser on http://localhost:4200/ **
```
##### Navigate to the [website](http://localhost:4200/)

## Backup and Restore MongoDB running in a Docker Container
Now the challenging part is to backup mongodb running in a docker container as part of the application stack

To make it simple run mongodump.sh attached in the project:
```
$ bash mongodump.sh
```
Even better is doing database backups on a scheduled basis in an automated way!.
Execute cronjob.sh to run backup as part of cronjob.
```
$ bash cronjob.sh
```

#### How does the Backup work in the background?
In the dockercompose file, a docker volume is attached between mongodb container and local machine. \
By executing mongodump.sh script, mongodump is executed to take backup in a specified directory that is linked to the docker volume. \
In the current directory, a folder "db_backup" is created where databases backup exsists in a *.bson formate. 

---
**NOTE**:
It is recommended to keep your database backups in a remote destination, ex: AWS S3 Bucket.

---

## Restore MongoDB the easy way!

Restorating MongoDB is an easy task, specially with Docker Volume in place.
- Copy mongo databases backups into the specified volume, and build containers again with Docker Compose.

That's it!. MongoDB container will start the databases from *.bson files!.

## Restore MongoDB with mongorestore

DB backup files (*.bson) must be copied to the container before executing mongorestore to restore database.

Simply execute $ docker cp cmd to copy files from host to docker container
```
$ docker cp [OPTIONS] SRC_PATH|- CONTAINER:DEST_PATH
$ docker cp db_backup/. bmg_db:/data/db
```

Then, execute mongorestore on the container to restore database
```
$ docker exec -it <CONTAINER_NAME> <CMD>
$ docker exec -it bmg_db mongorestore data/db/userslist/*.bson
```
# Docker Swarm Orchasteration (Deployment/Replicas)

## Setup multi-node swarm cluster
To enable Fault Tolerance it is recommended to operate with 3 manager nodes.

Docker uses the RAFT consensus algorithm for leader selection: if you have three managers, one manager can fail, and the remaining two represent a majority, which can decide which one of the remaining managers will be elected as a leader.

- Intialize Docker Engine in Swarm mode, the first node is selected as a leader.
```
$ docker swarm init
```
- Add other manager nodes to the swarm
```
$ docker swarm join-token manager

OUTPUT: docker swarm join --token SWMTKN-1-3xee4my7akl42ipp8tbcgrgbq23mdo98rqo12t7cg5b2tdzw1v-5cyapu5hco0exmejnahldbutv 192.168.0.23:2377
```
- Issue the previous command from the OUTPUT windowo on the other 2 nodes

**Check the status of swarm cluster, 3 manager nodes are available with fault tolerance enable for failover scenarios.**
```
$ docker node ls

ID                            HOSTNAME            STATUS              AVAILABILITY        MANAGER STATUS      ENGINE VERSION
v8rjz66z0cn42p430cb8nzjmk *   node1               Ready               Active              Leader              19.03.11
zkcolxgkjdh2vxs7a52kyam25     node2               Ready               Active              Reachable           19.03.11
y4ctoa23mrdeqhvsdxxxski17     node3               Ready               Active              Reachable           19.03.11
```

## Deploy a stack to the swarm
When running Docker Engine in swarm mode, you can use docker stack deploy to deploy a complete application stack to the swarm.

---
**NOTE**:
If you’ve already got a multi-node swarm running, keep in mind that all docker stack and docker service commands must be run from a manager node.

---

### Set up a Docker registry
Because a swarm consists of multiple Docker Engines, a registry is required to distribute images to all of them
```
$ docker service create --name registry --publish published=5000,target=5000 registry:2
```

- Check the registry service is deployed
```
$ docker service ls

ID                  NAME                 MODE                REPLICAS            IMAGE                              PORTS
kuzplg4y5i89        registry             replicated          1/1                 registry:2                         *:5000->5000/tcp
```

### Push the generated image to the registry
To distribute the web app’s image across the swarm, it needs to be pushed to the registry you set up earlier. With Compose, this is very simple:
```
$ docker-compose push
```
The stack is now ready to be deployed.

---
**NOTE**:
This step assumes you have previously built docker images from the dockercompose file.

---

## Deploy the stack to the swarm

- Create the stack with docker stack deploy:
```
$ docker stack deploy --compose-file docker-compose.yml stack_bmg

Creating network stack_bmg_default
Creating service stack_bmg_angular
Creating service stack_bmg_express
Creating service stack_bmg_database
```

- Check that it’s running with docker stack services:
```
$ docker stack services stack_bmg

ID                  NAME                 MODE                REPLICAS            IMAGE                                PORTS
dmqa390e3mcw        stack_bmg_express    replicated          1/1                 127.0.0.1:5000/bmg_backend:latest    *:3000->3000/tcp
pbpiyggkxd2i        stack_bmg_angular    replicated          1/1                 127.0.0.1:5000/bmg_frontend:latest   *:4200->4200/tcp
w3lyorx2523o        stack_bmg_database   replicated          1/1                 mongo:latest                         *:27017->27017/tcp
```

## Scale Replicas (In/Out Scaling)

Scale out containers running on multi-node docker swarm cluster

- Scale out replicas with docker service scale:
```
$ docker service scale SERVICE=REPLICAS
$ docker service scale stack_bmg_express=2
$ docker service scale stack_bmg_angular=3
```

- Check that service replicas is scaled out:
```
$ docker service ls

ID                  NAME                 MODE                REPLICAS            IMAGE                                PORTS
pbpiyggkxd2i        stack_bmg_angular    replicated          3/3                 127.0.0.1:5000/bmg_frontend:latest   *:4200->4200/tcp
w3lyorx2523o        stack_bmg_database   replicated          1/1                 mongo:latest                         *:27017->27017/tcp
dmqa390e3mcw        stack_bmg_express    replicated          2/2                 127.0.0.1:5000/bmg_backend:latest    *:3000->3000/tcp
```

## Clean up resources

Bring the stack down:
```
$ docker stack rm stack_bmg
```

Bring the registry down:
```
$ docker service rm registry
```

Bring Docker Engine out of swarm mode:
```
$ docker swarm leave --force
```