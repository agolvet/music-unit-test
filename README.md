# RNBO FM Synth
A simple FM synth interface made from an RNBO export.

## Prerequisites

In order to run this example, you'll need `node`, `npm`, and access to the command line. The `npx` binary ships with `node`, so just download and install that from the [Node.js downloads site](https://nodejs.org/en/download/). The recommended version is their latest `LTS`, which at the time of writing this document is version 16.

If have heard about `node` and `npm` before but would like to know more about the included `npx` Package Runner please refer to the [Node.js Documentation](https://nodejs.dev/learn/the-npx-nodejs-package-runner).

## Installation and running
1) Clone or download this repo to the directory of your choice.
2) In terminal navigate to the root of this repository install dependencies with the following command: 
```npm install```
3) Build the app using the following command: 
```npm run build```
4) Start the app with 
```npm run start```

Once the server started up successfully you may see something like the following in the console:

```sh
Available on:
  http://127.0.0.1:8080
  http://192.168.88.139:8080
Hit CTRL-C to stop the server
```
Open the shown URL, fe. `http://127.0.0.1:8080` in your default browser, if everything went well, you should see and hear your RNBO patch.
