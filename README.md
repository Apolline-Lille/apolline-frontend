
# Apolline-Frontend in NodeJS and with InfluxDB
#### Author: Arthur Baldeck
#### State in development

### Description of the app

This frontend app will allow the user to download CSV file with data from the air quality's InfluxDB database. We are using here a MeanJS boilerplate. MEAN is the acronym of MongoDB, Express, AngularJS and NodeJS and it is a strong starting point for apps which use this base.


### Prerequisites 
Make sure you have installed all of the following prerequisites on your development machine:
* GIT: [Download & Install Git](https://git-scm.com/downloads)
* Node.js: [Download & Install Node.js](https://nodejs.org/en/download/)
* MongoDB: [Download & Install MongoDB](http://www.mongodb.org/downloads)
* Bower (Manage your frontend packages)

You can install Bower by using the following command but be sure you have installed NodeJS and npm (Node Package Manager):

```bash
$ npm install -g bower
```

### Downloading the Apolline-Frontend app

You can get the whole code by cloning the Apolline-Frontend Repository:

```bash
$ git clone https://github.com/Apolline-Lille/apolline-frontend.git
```

### Install the dependencies
Once you cloned the app go into the directory where the app is, and then go to into the the directory named /meanjs:

```bash
$ cd apolline-frontend/meanjs
```  

Now we have to install all the dependencies by just writing: 

```bash
$ npm install
``` 

This command install all the dependencies needed for the application. When the npm packages install process is over, npm will initiate a bower install command to install all the front-end modules needed for the application
You can update these packages by using:

```bash
$ npm update
``` 

### Building the docker image and running the application
Go to the directory meanjs in the apolline-frontend app:

```bash
$ cd apolline-frontend/meanjs
```

You have to build the docker image:

```bash
$ docker build -t meanjs .
```
Once you build it write:

```bash
$ docker-compose up
```
This final command launch your app and finally you can go to the http://localhost:80/ in your browser to see the application.

To get the CSV and the data, once the bash show:
```bash
meanjs      | MEAN.JS - Development Environment
meanjs      | 
meanjs      | Environment:     development
meanjs      | Server:          http://0.0.0.0:80
meanjs      | Database:        mongodb://db/mean-dev
meanjs      | App version:     0.6.0
meanjs      | MEAN.JS version: 0.6.0
```
Open a new console and write:
```bash
curl http://0.0.0.0:80/measurements/loa
```

