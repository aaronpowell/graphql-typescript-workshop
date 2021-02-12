# Troubleshooting

## Incompatible Node.js version when starting GraphQL Server

The Azure Function Core Tools, which we use to run the GraphQL Server, does a check on the version of Node.js that is used and raises an error if it's not a supported major version. You can find the list of versions supported here: [https://aka.ms/functions-node-versions](https://aka.ms/functions-node-versions)

To check what version of Node.js you have installed, open a terminal and run:

```bash
node --version
```
