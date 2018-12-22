#!/bin/bash

docker build -t wordcannon/word .
docker push wordcannon/word

docker build -t wordcannon/dictionary -f Dockerfile-dictionary .
docker push wordcannon/dictionary

docker build -t wordcannon/punctuation -f Dockerfile-punctuation .
docker push wordcannon/punctuation

docker build -t wordcannon/fancy -f Dockerfile-fancy .
docker push wordcannon/fancy
