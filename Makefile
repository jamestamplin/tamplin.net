
#
# Includes.
#

ifndef NODE_ENV
	include .env
	export
endif

ifneq ($(wildcard ./node_modules),)
  include ./node_modules/makefile-help/Makefile
endif

#
# Variables.
#

babelnode = ./node_modules/.bin/babel-node
browsersync = ./node_modules/.bin/browser-sync

#
# Flags.
#

# Run commands in debug mode. (default: false)
DEBUG ?= false

#
# Config.
#

ifeq ($(DEBUG),true)
	babelnode += debug
endif

#
# Targets.
#

# Run the build script.
build:
	@ rm -rf ./build
	@ mkdir ./build
	@ $(babelnode) ./bin/build

# Remove all of the generated files.
clean:
	@ rm -rf ./build ./node_modules

# Install the dependencies.
install:
	@ npm install

# Compile the favicon.ico file from favicon.png with Imagemagick.
favicon:
	@ convert \
		./public/favicon-16.png ./public/favicon-32.png ./public/favicon-64.png \
		./public/favicon.ico

# Run the development server.
start:
	@ $(browsersync) start --server 'build' --files 'build' --port $(PORT)

#
# Phonies.
#

.PHONY: build
