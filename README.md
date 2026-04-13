# 🎮 Games Meeting - Gestor de biblioteca de Videojuegos

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![Railway](https://img.shields.io/badge/Railway-131415?style=for-the-badge&logo=railway&logoColor=white)

**Games Meeting** es una aplicación web *Full-Stack* (SPA) diseñada para unificar, gestionar y organizar colecciones personales de videojuegos multiplataforma. Permite a los usuarios llevar un control exhaustivo de su catálogo, estado de compleción y valoraciones, solucionando la fragmentación actual de los diferentes *launchers* y plataformas digitales.

---

## ✨ Características principales

* **Autenticación Stateless:** Sistema de seguridad robusto implementando JSON Web Tokens (JWT) y encriptación de contraseñas mediante algoritmo BCrypt.
* **Aislamiento de Datos:** Arquitectura multi-usuario donde cada colección es privada y accesible únicamente mediante verificación de tokens en cada petición HTTP.
* **Modelo Relacional (3FN):** Base de datos normalizada para evitar redundancias y garantizar la integridad referencial de catálogos maestros (Plataformas, Géneros, Estados, Formatos).
* **Data Seeding Automatizado:** Inyección dinámica de catálogos base mediante `CommandLineRunner` en el arranque del servidor.
* **Interfaz SPA Responsiva:** Frontend desarrollado en Vanilla JavaScript, optimizado para dispositivos móviles mediante *Media Queries* y diseño de rejilla flexible (CSS Grid/Flexbox).
* **Sistema de Valoración:** Escala Likert de 1 a 5 estrellas para la calificación personal del catálogo.

---

## 🛠️ Stack tecnológico

### Backend (API RESTful)
* **Lenguaje:** Java 21+
* **Framework:** Spring Boot 3.4.x
* **Seguridad:** Spring Security (JWT Auth)
* **Persistencia:** Spring Data JPA / Hibernate
* **Base de Datos:** MySQL 8.0

### Frontend (Cliente)
* **Estructura y estilos:** HTML5.
* **Estilos:** CSS3 puro (sin frameworks pesados).
* **Lógica:** Vanilla JavaScript (ES6+).
* **Peticiones:** Fetch API.

### DevOps & Despliegue
* **Control de Versiones:** Git / GitHub
* **Despliegue Cloud (PaaS):** Railway
* **Gestión de entornos:** Variables dinámicas para credenciales de acceso y puertos.

---

## 🗄️ Arquitectura de Base de Datos

El sistema implementa un diseño relacional que garantiza la consistencia de los datos. La entidad principal `Videojuego` mantiene una relación **N:1 (Many-to-One)** con las siguientes entidades paramétricas:
* `Genero` (Acción, RPG, Puzles...)
* `Plataforma` (PC, PlayStation, Steam...)
* `Estado` (Pendiente, Jugando, Completado)
* `Formato` (Físico, Digital)
* `Usuario` (Propietario de la colección)

---

## 🚀 Instalación y despliegue local

Para ejecutar este proyecto en un entorno local de desarrollo, sigue estos pasos:

### 1. Requisitos previos
* Java Development Kit (JDK) 21 o superior.
* Maven instalado.
* Servidor MySQL ejecutándose en el puerto `3306`.

### 2. Configuración de la Base de Datos
Crea una base de datos vacía en MySQL llamada `coleccion_videojuegos`:
```sql
CREATE DATABASE coleccion_videojuegos;
```

### 3. Clonar el repositorio
```Bash
git clone [https://github.com/Mansibond/Games_Meeting.git](https://github.com/TU_USUARIO/Games_Meeting.git)
cd Games_Meeting
```
### 4. Variables de entorno (application.properties)
El proyecto está configurado para leer variables de entorno y priorizar valores por defecto en local. Asegúrate de que las credenciales coincidan con tu servidor MySQL local en el archivo src/main/resources/application.properties:

Properties
* spring.datasource.url=${DB_URL:jdbc:mysql://localhost:3306/coleccion_videojuegos}
* spring.datasource.username=${DB_USER:tu_usuario_local}
* spring.datasource.password=${DB_PASSWORD:tu_contraseña_local}

### 5. Ejecución
Inicia la aplicación Spring Boot. El Data Seeding poblará la base de datos automáticamente.

```Bash
./mvnw spring-boot:run
```
La aplicación estará disponible en: http://localhost:8080

### ☁️ Entorno de Producción
El proyecto está preparado para Integración y Entrega Continua (CI/CD) a través de Railway.

La compilación se realiza automáticamente tras cada Push a la rama principal.

Las credenciales de MySQL de producción se inyectan de forma segura a través del panel de variables de entorno del proveedor Cloud.

Desarrollado por Adrián Mansilla - 2026 como Proyecto Intermodular.
