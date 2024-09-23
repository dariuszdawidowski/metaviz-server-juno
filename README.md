# Metaviz Server Juno
Metaviz is a visual project collaboration workspace. Good for making diagrams, project management, storing files and media.

## 🔨 Prerequisites
This repository contains the backend for the [Internet Computer](https://internetcomputer.org/) web3 blockchain and is based on the [Juno](https://juno.build) library.

If you want to create own instance - start to explore Juno concepts about Satellites and the running environment.

The frontend part of Metaviz is used directly from the CDN. If you want to explore more about this - see the References section below.

Required tools: [NodeJS](https://nodejs.org) with NPM and [Docker](https://www.docker.com/).

## 🧞 Commands

### Install:
Installs dependencies
```bash
npm install
```

### Run in the development mode (open two consoles):
Quickstart the local development emulator in the first console.
```bash
(Start Docker before)
juno dev start
```

Starts frontend dev server at `localhost:5173` in the second console.
```bash
npm run dev
```

### Usage in the development mode:
Open `localhost:5173` in your browser.
You will be asked to use an Internet Identity - just create a fake one locally.


### Deploy:
Build your production site to the `./dist/` directory.
```bash
npm run build
```

Deploy your project to a Juno Satellite (production).
```bash
juno deploy
```

## 🚀 About Juno and Satelitte
Explore this [guide](https://juno.build/docs/add-juno-to-an-app/create-a-satellite) to launch your Satellite into orbit via Juno's [administration console](https://console.juno.build).

## 📃 License
This project is licensed under the MIT license, see LICENSE for details.

## 🔗 References
- [Internet Computer](https://internetcomputer.org)
- [Juno](https://juno.build)
- [NodeJS](https://nodejs.org)
- [Docker](https://www.docker.com/)
- [Metaviz Editor](https://github.com/dariuszdawidowski/metaviz-editor)
- [Total Diagram](https://github.com/dariuszdawidowski/total-diagram)
- [Total Popup](https://github.com/dariuszdawidowski/total-popup)
- [Total Pro Menu](https://github.com/dariuszdawidowski/total-pro-menu)
- [Total Text](https://github.com/dariuszdawidowski/total-text)