# plantillas_formularios_dinamicos_crud

Repositorio para el almacenamiento de plantillas para el sistema de formularios dinamicos

API CRUD desarrollada en NestJS para la gestión de base de datos no relacional (MongoDB).

# Especificaciones Técnicas

## Tecnologías Implementadas y Versiones

- [NestJS](https://github.com/nestjs/nest)
- [MongoDB](https://github.com/mongodb/mongo)

**Entorno Local:** NodeJS Version: v18.16.0 | NPM Version: 10.7.1 | Nest CLI Version: 8.2.6 | MongoDB version: v4.4.6

## Variables de Entorno

```shell
USER: process.env.PLANTILLAS_FORMULARIOS_DINAMICOS_USER,
PASS: process.env.PLANTILLAS_FORMULARIOS_DINAMICOS_PASS,
HOST: process.env.PLANTILLAS_FORMULARIOS_DINAMICOS_HOST,
PORT: process.env.PLANTILLAS_FORMULARIOS_DINAMICOS_PORT,
DB: process.env.PLANTILLAS_FORMULARIOS_DINAMICOS_DB,
HTTP_PORT: process.env.PLANTILLAS_FORMULARIOS_DINAMICOS_HTTP_PORT,
AUTH_DB: process.env.PLANTILLAS_FORMULARIOS_DINAMICOS_AUTH_DB,
```

**Nota:** Las variables se pueden encontrar en el fichero _src/config/configuration.ts_ y están identificadas con **PLANTILLAS_FORMULARIOS_DINAMICOS***

## Ejecución del Proyecto

```shell
#1. Clonar el repositorio
git clone git@github.com:udistrital/plantillas_formularios_dinamicos_crud.git #Opcion 1: Via SSH
git clone https://github.com/udistrital/plantillas_formularios_dinamicos_crud.git #Opcion 2: Via HTTPS

#2. Moverse a la carpeta del repositorio
cd plantillas_formularios_dinamicos_crud

#3. Moverse a la rama **develop**
git pull origin develop && git checkout develop

#4. Instalar dependencias
npm install
# Si no se instalan en su totalidad, ejecutar:
npm install --save @nestjs/mongoose mongoose
npm install --save @nestjs/swagger swagger-ui-express

#5. Alimentar todas las variables de entorno que utiliza el proyecto.
ESPACIOS_ACADEMICOS_CRUD_HTTP_PORT=3000 ...
```

## Ejecución Pruebas

Pruebas unitarias

```shell
# En proceso...
```

# Modelo de Datos

![Modelo de datos Formularios dinámicos](/database/Modelo_de_datos_formularios_dinámicos_v7.png)

# Licencia

This file is part of espacios_academicos_crud.

plantillas_formularios_dinamicos_crud is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

plantillas_formularios_dinamicos_crud is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with novedades_crud. If not, see https://www.gnu.org/licenses/.
