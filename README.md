# service
back end

# local development

## build

```
git clone https://github.com/WordCannon/service.git
cd service
npm install
```

## run

```
npm start
```

```
➜  ~ curl localhost:8080/word
favoredness
➜  ~ curl localhost:8080/word
dovening
➜  ~ curl localhost:8080/word
nonferociously
➜  ~ curl localhost:8080/word
```

# docker

## docker build

```
docker build -t wordcannon/service .
```

## docker run

```
docker run --rm -p 8080:8080 wordcannon/service
```

# supported languages

* afrikaans
* bulgarian
* danish
* estonian
* german
* hungarian
* kazakh
* macedonian
* romanian
* slovenian
* turkish
* albanian
* catalan
* dutch
* farsi
* greek
* indonesian
* korean
* norwegian
* russian
* spanish
* ukrainian
* arabic
* chinese
* english
* finnish
* hebrew
* italian
* latvian
* polish
* serbian
* swedish
* vietnamese
* bengali
* czech
* esperanto
* french
* hindi
* japanese
* lithuanian
* portuguese
* slovak
* thai
