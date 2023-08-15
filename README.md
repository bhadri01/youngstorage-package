# youngstorage-heart

## how to setup
> Things that we need to check is connection ipAddress and subnetting serious need to check both frontend and backend

## Frontend
```
api/config.js // This config for to make MQTT connection
api/api.js    // this is to make API calls to backend
```
> just check this ip serious ans service ipaddres that we are currently running on it

## Backend
```
.env # just vist the .env file and make sure all the thing's are config correctly
```

## Creating the network for the Heart
> currenlty the backend docker run --network is in youngstorage_heart. So create the network with the same or
> else if u need to edit na just go to the /app/lib/docker/dockerGenerator.py find for .run your will reach the
> docker run command that where writen in Docker SDK. Just edit the network name

```
# command to create the network
docker network create --subnet=172.20.0.0/16 youngstorage_heart
```

## Make sure service reserve ip
> Before running the docker compose please check the reserviec ip's that where assigned to the services and the + make sure
> that your network ipadress and the services ip addres should be in same subneting

## Finish the setup
```
# execute the command
docker compose up -d
```
