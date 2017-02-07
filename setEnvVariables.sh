#!/bin/bash
export TS_NODE_COMPILER_OPTIONS={\"module\":\"CommonJS\"\,\"target\":\"ES5\"}
./node_modules/.bin/mocha --compilers ts:ts-node/register
