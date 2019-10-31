#!/bin/bash

export TAG="0.0.2"

echo "TAG IS $TAG"

docker build -t "wordcannon/word-generator:${TAG}" .
docker push "wordcannon/word-generator:${TAG}"