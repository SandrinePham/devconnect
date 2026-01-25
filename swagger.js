const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de gestion de projets",
      version: "1.0.0",
      description:
        "Documentation de l'API permettant de gérer les projets, les commentaires et les utilisateurs",
    },
    servers: [
      {
        url: "http://localhost:5500",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;