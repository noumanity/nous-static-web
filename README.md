# nous-static-web


Implementación de [nous](https://github.com/noumanity/nous) por un sitio web.


![how it work](https://docs.google.com/drawings/d/e/2PACX-1vRc84d-4sMrHAsqcDveEi5NEfdTqYe3cPM3zjkyHIktrrm2Wxv5_vm_cUBnqGU-QQZdtyHwKQVB4qjy/pub?w=1006&h=854)


# Uso

```
# Generar un sitio web con el plantilla 'vitrine_web'
# defecto diseno y contenido 
nous g vitrine_web

# y miralo
firefox build/index.html
```


```
# Generar un sitio con otra contenido

git clone git@github.com:noumanity/vitrine-web
cd vitrine-web

nous g -c contenido.yml vitrine-web
```


## Instalación


### Con Docker

Comandos configurados están disponibles en el script `./dev`.
```
# construye e inicia nous
./dev up

# usa nous
./dev sh nous g vitrine_web 

# o con alias
alias nous="$(pwd)/dev sh nous"
nous g vitrine_web 

# granja y destruye el servicio
./dev down
```

Los archivos se pueden editar localmente.

Y podemos entrar en el contenedor

```
./dev sh
```

### En Linux

```
git clone git@github.com:noumanity/nous-static-web
cd nous-static-web
./setup.sh
echo "export PATH=$PATH:$(pwd)/bin" >> ~/.bashrc
. ~/.bashrc
````



