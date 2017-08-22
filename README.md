# BenarID

BenarID is a crowdsourced, collaborative Indonesian news rating app.

This is the repo for the chrome browser extension.

This is still a work in progress!

## Development

Follow this guide to start development.

### Build and Install

Requirement:

1. Node.js >= v8.x.x

To build and install this extension, follow these steps:

1. Clone this repo
2. `npm i`
3. `npm run build`
4. `npm run bundle`
5. Go to `chrome://extensions/` on Chrome
6. Drag and drop the `static/` directory to the window.

### Test

`npm test`

### Local Development

Since this project is written in BuckleScript, we will install OCaml related stuff for development tools:

1. Install [OPAM](https://opam.ocaml.org/) >= v1.2.2
2. `opam switch 4.02.3+buckle-master`
3. ``eval `opam config env` ``
4. `opam install merlin.2.5.5 ocp-indent`

> I highly suggest using [VSCode](https://code.visualstudio.com/) with [vscode-ocaml extension](https://marketplace.visualstudio.com/items?itemName=hackwaly.ocaml) and turning `editor.formatOnSave` settings on for better editing experience. I have included `./vscode/tasks.json` for build and test tasks. However, you can use your own favorite editor if you so wish. Just don't forget to format with ocp-indent.

Follow the "Building and Installing" steps, but replace step 4 with `npm run watch` (or just use `Tasks: Run Build Task` from VSCode). Every change to the `.ml` files will now be watched and rebuild.

After each change, don't forget to reload the extension via `chrome://extensions/`.

## License

The license is still being worked on. Until then, all rights reserved.
