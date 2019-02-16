# Acidlabs Challenge

Solución propuesta por Carlos Hincapié :)


## Tecnologías utilizadas

- Bootstrap 4.3.x
- ReactJs 16.8.1
- NodeJs 10.15.1
- Webpack 4.29.3
- Redis 5.0.3
- Socket.io 2.2.0

## Decripción del flujo de funcionamiento

Al iniciarse la aplicación en el servidor, lo primero que sucede es inciar la conexión con Redis, si esta se da correctamente, se guardará la información de las ciudades que toma del archivo `cities.js` iniciará el servidor en el puerto 8080 y creará el servidor socket el cuál quedará esperando alguna conexión de algún cliente.

Mientras que no exista una conexión de algún cliente, no se realizarán peticiones al servicio de Forecast.io. Cuando un cliente se conecta, se activa por medio de un setInterval, las peticiones al servicio de Forecast.io cada 10 segundos (teniendo en cuenta el 10% de probabilidad de falla en cuyo caso añade un registro más a la clave api.errors de Redis), almacenando el resultado en Redis y enviándolo a todos los clientes que estén conectados en el momento. Mientras que cuando se desconectan todos los clientes, el setInterval creado se borra para así evitar hacer peticiones que nadie va a consumir.

En el frontend, cuando se recibe un evento del socket, se toma el payload enviado y se actualiza el estado del componente `Dashboard` el cual se encarga de renderizar un componente `City` por cada ciudad existente en el payload enviado.

## Despliegue a producción

Para el despliegue a producción se utilizó una instancia en AWS de Amazon Linux AMI. 

- El primer paso fue instalar y configurar Git, NodeJs, Redis y el paquete PM2.
- Se configuró un ip_forward para redireccionar todas las peticiones del puerto 80 hacia el puerto 8080 utilizado en la aplicación.
- Se creó un Bare Repository de git en el servidor para que con la ayuda del hook post-receive, facilitara el despliegue del código fuente.
- Luego de hacer push a este repositorio, se instalaron las dependencias del proyecto con `npm install`, y posteriormente se generaron los archivos de distribución con la ayuda de Webpack con el comando `npm run build`.
- Por último se configuró la aplicación como un servicio de auto arranque con la ayuda de PM2.

## Consideraciones

Como se está utilizando Forecast.io, un servicio gratuitamente limitado, el cual sólo permite 1.000 peticiones por día. Se recomienda abrir la aplicación sólo cuando se considere necesario :)