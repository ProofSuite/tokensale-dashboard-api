# Node Deployment Documents

The Node Api is set up to interface as a support API with the Proof Token Dashboard Angular 2 App.  They interface with a basic API token that is traded using the jwt library.  The backend database for the api is a mongo-db backed api that holds 2 things: referral codes and basic user information.  Database schema information follows in this document.

{{TOC}}

# 1. Requirements
- Node 8+
- NPM (included with latest versions of Node)

The Proof Tokensale Dashboard requires node/npm.  The version we use for deployment and run time are Node v8.7.0 and npm v5.4.2. We expect that the application will work with later versions of Node.  

- MongoDB

The NoSQL databasing software, Mongo, is the Currently, the API words with Mongo 3.2.17 and should function with any 3.x.x version of Mongo.  The interfacing library is Mongoose whose documentation & Quickstart can be found [here]("http://mongoosejs.com/docs/index.html")


### Linux: Debian || Ubuntu Node installation (Package Manager)
[Source]("https://nodejs.org/en/download/package-manager/")

First get the reference information for node 8.x from the package repository:

`curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -` 

Next, install node:

`sudo apt-get install -y nodejs`

If you need further Installation help with your particular version of Linux or wish to build from source check out the [node.js installation instructions and installer repo]("https://nodejs.org/en/download/").

### MacOS Node installation (Official Installer)

Get the official [MacOS installer]("https://nodejs.org/dist/v8.9.1/node-v8.9.1.pkg"). 

Open the .pkg you just downloaded and follow the directions on the dialogue.

If you prefer using home-brew for installing software, follow [this tutorial]("https://changelog.com/posts/install-node-js-with-homebrew-on-os-x") for getting set up.

### Windows Node installation (Official Installation)

Get the official [Windows installer]("https://nodejs.org/dist/v8.9.1/node-v8.9.1-x86.msi") and follow the onscreen instructions for setting up node.

NOTE: We recommend running the Node API on either a MacOS or Linux-based operating system.  From here forward, this deployment document will use linux-bash syntax in order to describe configuration commands.  In order to follow along you may need to check out some of the ways to use Bash in Windows located in the [TroubleShooting](#4.Troubleshooting) section of this document.

## 2. Deployment

- In order to build a simple clone of the source files first run:

`git clone <repo_url>`

- After cloning the git enter the root directory of the node application and run:

`npm install`

- After installing the required dependencies you will need to start a MongoDB instance that you then place in your application.  If you know how to do this, proceed to do this now on your server.  Afterwards, build a [mongo construction string]("https://docs.mongodb.com/manual/reference/connection-string/") and place it inside the file server.js like so:

`mongoose.connect("mongodb://localhost:27017/databasename")`

Take note that this is probably not the right connection string for your particular database.  Checkout the Troubleshooting & Quickstart below for more info on configuring Mongo with this App.

- If you need help getting mongo set up checkout the 'Getting Mongo ready for Deployment' section in the Troubleshooting section of this document.

- Finally, run:

`npm start`

This should spin up a server on port 3000.  If you do not wish to run on the default port check out the Configuration information below.

## 3. Configuration


**Server Configuration**

 This configuration guide is for simple server configuration.  For more information about how to tweak and customize individual aspects of the API software and Dashboard refer to the "Configuration_Guide.md" file found in the /docs folder of the app. 

Base File:

`APP_ROOT/ + config/env.js`

There are two configuration files that mainly need to be looked at in order to operate the Proof Tokensale Dashboard node API.  You should see a file with the following information.  Follow the comments for configuration instructions:

```javascript

//config/env.js

module.exports = {
    /* 
    Change the data field of key 'PORT' to change
    Which part the app will be hosted on
    */
    
    'PORT' : 3000, //Port that Api will be hosted on

    /*
    This is the data that will construct your mongo connection-string.
    */
    'DB_HOST'     : 'localhost',
    'DB_NAME'     : 'admin',
    'DB_PORT'     : '27017', //Default Mongo DB
    'DB_USERNAME' : '',
    'DB_PASSWORD' : '',
   
    /* 
    Host URL or IP for the API.
    This is unused at the moments see 'TO DO's in documentation'
    */

    'BASE_URL' : '',

    /* 
    Configuration for JWT token 
    */
    
    'algorithm' : 'HS256',
    'expiresIn' : '2h',
    'JWT_SECRET'     : 'XaA6JrXR1G0',
    'JWT_ALGORITHEM' : 'HS256',
    'TOKEN_EXPIRY'   : '2h',
    
        //JWT Static token
    STATIC_TOKEN     : 'YOUR_STATIC_TOKEN',

    /* 
    Pagination
    */
    
    SORT_BY          : 'CreatedAt',
    SORT_ORDER       : 'desc',
    PAGE_NUMBER      : 1,
    RECORDS_PER_PAGE : 10
};
```

If changing the data under the 'PORT' key will change which port the api is hosted on.  

The `STATIC_TOKEN` can be any string that matches the `STATIC_TOKEN` that is located in the accompanying Angular App, although something generated through jwt is preferred.  Dynamic jwt generation will be added and will be added in the future.

**Database**

This section assumes that you have a working installation and configured MongoDB installation already and know how to log in, view, and authenticate your mongo installation.  If you do not know how to do this check the Troubleshooting & Appendix section for assistance with getting set up.  

For the rest of this guide we will use a database called 'tokenDB' and a user 'tokenApi' with the password 'admin123' (We do not recommend using this as a user configuration in deployment, however.).  

The API has built-in 3 schemas for Mongo which will automatically make entries into your database based off of this schema.  You can find this schema in the `app/components/User` and  `app/components/Refercode` and `app/components/Transaction` folders.  

The Schema files are suffixed with `*Controller.js`, `*Model.js`, `*Route.js`, `*Schema.js`. 

The node API utilizes the library, Mongoose.  Full documentation  and a Quickstart can be found [here]("http://mongoosejs.com/docs/index.html") although only a cursory knowledge of the library are necessary for Mongo usage with the Node-API.

- Setting your db is as simple as visiting the /config/env.js (as outlined above) and switching the constants to the preferred values like so:

```
    'DB_HOST'     : 'localhost',
    'DB_NAME'     : 'tokenDB',
    'DB_PORT'     : '27017', //Default Mongo DB
    'DB_USERNAME' : 'tokenApi',
    'DB_PASSWORD' : 'abc123',
```

This should generate a string that looks like this:

`mongodb://tokenApi:abc123@localhost:27017/tokenDB`

as an argument for the mongoose.connect() function.

After this, your database should be set up on your node API.

**Mailer**

This mailer has been set up to utilize SendGrid as the main nodemailer Api.  If you do not want to use SendGrid, check out [the nodemailer docs]("https://nodemailer.com/smtp/") for a guide on how to set up your own SMTP relay.  Any work you want to do should happen on the `app/components/mailer/mail.js` file

*Setting up a Sendgrid module*

create a `.env` file inside of the root level of your API directory.  Inside of this file add:


`SENDGRID_API_KEY='<YOUR_SEND_GRID_KEY>'`

and run:

`npm install`

Regardlss of the mailer you set up, your config should end with the code:

```
var transporter = nodemailer.createTransport(options || [sgTransport(options)]);

module.exports.transporter = transporter;
```


# 4. Appendix & Troubleshooting


## 4.1.0 Installing Mongo

Installing Mongo correctly in order to quickly use an app can be a real hassle.  Here we go over the basic way to set up a database on your server on multiple systems as well as how to get your database ready.

### MacOS (Homebrew)

[source]("https://treehouse.github.io/installation-guides/mac/mongo-mac.html")

- Open the terminal and type `brew update`.
- After updating Homebrew type `brew install mongodb`.
- After the download is finished, create a directory for data files to live.  The default is `/data/db` which still needs to be created with the command:

`mkdir -p /data/db`

- Ensure that the `/data/db` directory has the right permissions by running:

``` 
sudo chown -R `id -un` /data/db
```

- You will have to enter your password after this command.
- **Run the Mongo daemon**: in a terminal window by running `mongod` (short for mongo daemon).  This will start a Mongo server.
- **Run the Mongo Shell**, with the Mongo daemon running type `mongo` in another terminal window.  This will run the Mongo shell which is an application to access data in MongoDB.
- In the *Mongo Shell* run quit() to exit
- To leave the *Mongo Daemon* hit ctrl-c

- If you want to set your Mongo instance to run as a subprocess use:

`mongod --fork --logpath <path/to/preferred/logfile.log>`

### Linux: Ubuntu 16.04 (Package Manager)
[source]("https://www.howtoforge.com/tutorial/install-mongodb-on-ubuntu-16.04/")

- **Importing the Public Key**: to ensure package consistency and authenticity run the following command:

` sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927`

- **Create source File List file MongoDB**: Run this command to create a list file for MongoDB:

`echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list`

- **Update the repository**: update the repository with the apt command:

`sudo apt-get update`

- **Install MongoDB**: Now you can install MongoDB by typing this command:
`sudo apt-get install -y mongos-org`

- **Create a new mongoldb system file in `lib/systemd/system`**: Go to the lib/systemd/system directory an create the new mongoldb service file 'mongod.service' with vim:

```
cd /lib/systemd/system/
vim mongod.service
```

After opening in vim (or nano or emacs etc.) press 'i' to activate insert mode and paste the script below:

```
[Unit]
Description=High-performance, schema-free document-oriented database
After=network.target
Documentation=https://docs.mongodb.org/manual

[Service]
User=mongodb
Group=mongodb
ExecStart=/usr/bin/mongod --quiet --config /etc/mongod.conf

[Install]
WantedBy=multi-user.target
```

Save the file and exit.

Now update the system service with command below:

`systemctl daemon-reload`

Start mongoldb and add it as service to be started at boot time:

```
systemctl start mongod
systemctl enable mongod
```

Now check that mongoldb has been started on port 27017 with the netstat command.

`netstat -plntu`

### Installing Mongo on Windows (Off Site)

Because the installation of MongoDB on Windows is an extremely in-depth process that would make this file extremely large. please visit [here]("https://docs.mongodb.com/v2.8/tutorial/install-mongodb-on-windows/") for directions on how to install on Windows.  

## 4.1.1 Getting Mongo Ready for Deployment

The rest of the Mongo Appendix is set up for linux/MacOS machines.  If you are using windows substitute directory references with the equivalent Windows path.

**Setting up a User**

[source]("https://docs.mongodb.com/manual/tutorial/enable-authentication/")

- Start MongoDB without Access Control

`mongod --port 27017 --dbpath /data/db1`

- Connect to the instance
`mongo --port 27017`

You may need to specify additional command line options such as `--host`.

- In the Mongo command line Set your database to admin

`use admin`

- **Create the user Administrator:** In the admin database, add a user with the userAdminAnyDatabase role.  For example, the following creates the user myUserAdmin in the admin database.

```
db.createUser(
    {
      user: "admin",
      pwd: "abc123",
      roles: [{role: "userAdminAnyDatabase", db: "admin"}]
    }
)
```

- Disconnect from the mongo shell

- Restart MongoDB instance with access control:
`mongod --auth --port 27017 --dbpath /data/db1`

Clients must now connect to this database using authentication

- Connect and authenticate as the user admin:
`mongo --port 27017 -u "admin" -p "abc123" --authenticationDatabase admin`

- Create a new db of your choosing.  For this example we are going to use the name 'tokenDB' with:
`use tokenDB`

- Next, you need to create a user for this database with:
`db.createUser({user:"tokenApi", pwd: "abc123", roles: [{role: "readWrite", db: "tokenDB"}]})`

You should see a success message

- Finally, logout with the command inside of the mongo commandline:
`exit`

## 4.2.0 Configuring Windows Terminal for Linux Bash commands

For the most robust way to get Linux-like and POSIX-like behaviors on Windows check out the [Cygwin project]("https://www.cygwin.com/") and follow their guides to get started.

Otherwise for fully native BASH usage, how to geek has a good beginners guide to getting BASH on Windows 10 located [here]("https://www.howtogeek.com/249966/how-to-install-and-use-the-linux-bash-shell-on-windows-10/"). 

Another option is to use Powershell which has some Bash command functionality.  Conversely, you can see Windows specific bash commands [here]("https://commandwindows.com/command3.htm")

# 5. TO DO's
- Easy Mongo Deployment Script
- Keep this documentation updated
- Clean up 
- Dynamic JWT creation