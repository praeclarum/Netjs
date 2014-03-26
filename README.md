# Netjs

Netjs is a .NET to JavaScript compiler.

## Installation

### Install Netjs

Download it:

	git clone https://github.com/praeclarum/Netjs.git

#### Mac

	sudo make install

This will install a soft link called `netjs` in `/usr/bin` to the script `netjs.sh`.

#### Windows

	msbuild

`Netjs.exe` will be built in `Netjs\bin\Debug`. You can copy this executable to someplace in your PATH to make it readily available.


### Install Node

[http://nodejs.org/download/](http://nodejs.org/download/)

Node is needed by the TypeScript compiler.

### Install TypeScript

	sudo npm install -g typescript




## Compiling Code

Netjs works with .NET assemblies built with any compiler ([limitations][Limitations] not withstanding).

### Compile to TypeScript

	netjs Library.dll

This will output a TypeScript file named `Library.ts` containing all the code from `Library.dll` and any other assemblies referenced in its directory.

### Compile to JavaScript

	tsc -t ES5 Library.ts mscorlib.ts --out Library.js 

This compiles the library code along with a small implementation of mscorlib. The files are merged and output as a single JavaScript file `Library.js`.



## Limitations

* **Namespaces are ignored**
* mscorlib.ts is a **small subset** of the full BCL
* **Virtual overloaded methods** do not work
* **Async** does not work
* **Gotos** only sometimes work

