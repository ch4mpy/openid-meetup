cd bar-api
mvn clean integration-test
cd ../angular-clients
npm i
ionic build -c=prod-web
cd ../bar-api
mvn install azure-webapp:deploy
cd ..
