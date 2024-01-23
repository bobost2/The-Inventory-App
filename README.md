## Demo
To test the functionality of the app you can visit [this link](https://the-inventory-app.bobost.net/). Keep in mind that this demo can get shut down in the near future, since it's currenly self-hosted.

## Installation guide

Firstly, you will need a database. This project uses MongoDB and I recommend either self-hosting a MongoDB instance or use the free tier database from their [official webiste](657a197c5136d37474e4999f).

After that create an .env file in the root directory containing the variables `MONGO_CONNECTION_STRING`, `NEXTAUTH_SECRET` and `NEXTAUTH_URL` (use `http://localhost:3000` during development). 
<br><br>The file should look something like this:
```
MONGO_CONNECTION_STRING=<MongoConnectionString>
NEXTAUTH_SECRET=<RandomlyGeneratedPassword>
NEXTAUTH_URL=<WebsiteURL>
```
<br>
Next, install the missing modules via npm:

```bash
npm i
# or
npm install
```
After that for development you can use this command:
`npm run dev`

If you want to deploy it somewhere, you will have to build the project and then run it by using these commands:
```bash
# Build the project
npm run build

# Run the project
npm run start
```
