require("dotenv").config();

const { createYoga } = require("graphql-yoga");
const { schema } = require("./schema");
const { createServer } = require("http");
const { initDbs } = require("./init");

const port = parseInt(process.env.PORT) || 7100;

(async () => {
  await initDbs();
  console.log("DB initialized");

  const yoga = createYoga({ schema });
  const server = createServer(yoga);
  server.listen(port, () => {
    console.info(`Server is running on http://localhost:${port}/graphql`);
  });
})();
