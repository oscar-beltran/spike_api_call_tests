# spike_api_call_tests

# Descripcion
Repositorio que tiene una prueba de concepto de distintas estrategias para el llamado del mock de una API que tiene paginación y la construcción de la respuesta de todas las páginas en back

# Requisitos
- Node.js v18.18.2
- npm v9.8.1
- [Mockoon](https://mockoon.com) V7.0.0

# Funcionamiento

## Disponibilizar mock del servicio a consumir
Cargar en Mockoon el environment [names_api](./static/names_api.json)
  - Esto debe disponibilizar un mock en el puerto 3045, si ya está ocupado por favor cambiarlo tanto en el archivo [config](/src/config.ts) como en [names_api](./static/names_api.json) o en Mockoon

## Usando el proyecto

### Descargar dependencias

```sh
npm i
```

### Iniciar el proyecto

```sh
npm start
```

## Recursos disponibles

A continuación, se adjuntan los curls usados para usar cada uno de los distintos recursos que implementan una técnica de consumo de APIs diferente

### Llamado secuencial
Hasta que no recupera la información de una página no intenta recuperar la siguiente. La estrategia que más tiempo toma.

Con la configuración actual del mock, este servicio tarda `20` segundos en responder.
```sh
curl 'http://0.0.0.0:3000/getNamesSync'
```
### Llamado asíncrono
Recupera todas las páginas al mismo tiempo. La estrategia que menos tiempo toma pero que, potencialmente, puede poner más carga en el servicio de la API consultada.

Con la configuración actual del mock, este servicio tarda `4` segundos en responder.
```sh
curl 'http://0.0.0.0:3000/getNamesAsync'
```
### Llamado asíncrono por lotes
Hace únicamente algunos llamados asíncronos a la API y espera a obtener la respuesta. Una vez finalizado continúa con el siguiente lote. Se puede considerar una mezcla de las dos técnicas anteriores. No es tan lenta como la primera, pero es menos probable que sature a la API consultada.

Con la configuración actual del mock y el tamaño del lote, este servicio tarda `8` segundos en responder.
```sh
curl 'http://0.0.0.0:3000/getNamesBatchingAsync'
```
