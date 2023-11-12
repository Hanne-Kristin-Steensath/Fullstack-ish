# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

Github repository lenk:
https://github.com/Hanne-Kristin-Steensath/Fullstack-ish

HTTPS clone:
https://github.com/Hanne-Kristin-Steensath/Fullstack-ish.git

Link to application:
http://108.142.163.69:3000/

## Initial Data Insertion with Docker Compose

### Step 1: Copy "init.sql" to the Database Container

You can copy the "init.sql" file into the database container using the following command:

```bash
docker-compose cp init.sql database:/docker-entrypoint-initdb.d/init.sql

To load the SQL file into the database, you can use the following

docker-compose exec command:
docker-compose exec database psql -U postgres -f /docker-entrypoint-initdb.d/init.sql
```
