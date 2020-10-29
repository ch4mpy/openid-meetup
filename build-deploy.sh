cd cafe-skifo
mvn clean integration-test
cd ../angular-clients
npm i
ionic build -c=prod-web
cd ../cafe-skifo
mvn install azure-webapp:deploy
cd ..
