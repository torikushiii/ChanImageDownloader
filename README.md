# ChanImageDownloader

An image downloader for 4chan and display it in a web page.

## Prerequisites

- [Node.js](https://nodejs.org/): ^16.0.0
- [Yarn](https://yarnpkg.com/)
- [NPM](https://npmjs.org/) or any other Node.js package manager

## Installation

Install packages with your preferred package manager, e.g. npm:

```
yarn/npm install
```

## Usage

To start the server, run:

```
node index.js
```

console will show the port the server is running on.

- Open your browser and go to `http://localhost:8988` or any other port you specified in the config file.

```json
module.exports = {
	host: "0.0.0.0",
	port: 8988,
	blacklist: [
		// image hashes go here
	],
	boardList: {
		vg: [
			{
				name: "Nikke General",
				prefix: "nikg",
				folderName: "Nikke",
				hidden: false
			},
            {
				name: "Granblue Fantasy",
				prefix: [
                    "gbfg",
                    "GranblueFantasy"
                ],
				folderName: "gbfg",
				hidden: false
			}
		]
	}
};

```

## Configuration file

- `host`: The host the server will listen on.
- `port`: The port the server will listen on.
- `blacklist`: An array of image hashes to be ignored.
- `boardList`: An object containing the boards to be downloaded. Each board is an array of threads to be downloaded. Each thread is an object containing the following properties:
  - `name`: The name of the thread.
  - `prefix`: The prefix of the thread. (Accept Array of strings) (e.g. `["gbfg", "Granblue Fantasy"]`)
  - `folderName`: The name of the folder to be created for the thread.
  - `hidden`: Whether the thread should be hidden from the index page if you're hosting it to the public.