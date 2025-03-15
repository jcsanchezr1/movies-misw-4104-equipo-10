# Enlaces
  - [Jenkins](http://157.253.238.75:8080/jenkins-misovirtual/)
  - [Sonar](http://157.253.238.75:8080/sonar-misovirtual/)

## Prerrequisitos

Antes de comenzar, asegúrate de tener instalados los siguientes requisitos:

- Visual Studio Code configurado y actualizado

- Bootstrap para el diseño responsivo

- nvm (Node Version Manager) para gestionar las versiones de Node.js

- Angular CLI para el desarrollo en Angular

## Instalación

Sigue estos comandos para instalar y configurar el entorno:

### Configurar NVM

```
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```
### Verificar la versión de NVM
```
nvm --version
```

### Instalar Node.js 18.17.1
```
nvm install 18.17.1
```

### Instalar la última versión de Node.js
```
nvm install node
```

### Usar la versión 18.17.1
```
nvm use 18.17.1
```

### Listar las versiones instaladas de Node.js
```
nvm list
```

### Instalar Node.js 20
```
nvm install 20
```

### Usar la versión 20
```
nvm use 20
```

### Instalar Angular CLI versión 22.5.1 de forma global
```
npm install -g @angular/cli@22.5.1
```

### Mostrar todas las versiones disponibles de Angular CLI
```
npm show @angular/cli versions --json
```
### Instalar la última versión de Angular CLI de forma global
```
npm install -g @angular/cli@latest
```

### Ejecutar la aplicación Angular
ng serve

**Nota:**  Accede a la aplicación en tu navegador en `http://localhost:4200/`