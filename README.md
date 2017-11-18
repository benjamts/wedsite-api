The API For Tyler And Sarah's Wedding Website

## Setup

Developed on `node@6.10.1`, `npm@3.10.10` and `Docker version 17.09.0-ce, build afdb6d4`

```bash
# create a .env file with some dev config
tee .env <<EOF > /dev/null
DATABASE_URL=postgres://wedsiteapi:password@localhost:5432/wedsite
PORT=3000
INVITE_CODE=foo
EOF

# install node_modules
npm install

# pull the latest postgres docker image
docker pull postgres

# start the database in detached mode
npm run start:db

# run schema migrations
npm run migrate
```

## Running

```bash
npm start:api
```

If your app is running, you should get 200 from `localhost:3000/_health`
If your app and database are both running, you should get 200 from `localhost:3000/_db_health`

## Running Queries Directly

```bash
# Get a psql shell into the dev database. The password is "password"
npm run psql
```

## Resetting The Database

```bash
# stop the running database container
# you will lose any data stored therein
npm run stop:db

# restart the database in detached mode
npm run start:db

# remigrate
npm run migrate
```
