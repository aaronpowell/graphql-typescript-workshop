#!/usr/bin/env bash

set -euxo pipefail

ipAddress=https://$(docker inspect graphql-ts-cosmos-step6 -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}'):8081

# Try to get the emulator cert in a loop
until sudo curl -ksf "${ipAddress}/_explorer/emulator.pem" -o '/usr/local/share/ca-certificates/emulator.crt'; do
  echo "Downloading cert from $ipAddress"
  sleep 1
done

sudo update-ca-certificates

if [ ! -f ./api/local.settings.json ]; then
  echo "{ \"IsEncrypted\": false, \"Values\": { \"FUNCTIONS_WORKER_RUNTIME\": \"node\", \"CosmosDB\": \"AccountEndpoint=$ipAddress/;AccountKey=C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==\" } }" >> ./api/local.settings.json
else
  echo "AccountEndpoint=$ipAddress/;AccountKey=C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw=="
fi
