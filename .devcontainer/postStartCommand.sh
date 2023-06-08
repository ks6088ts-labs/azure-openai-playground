#!/bin/bash

set -eu

yarn install
exec yarn start
