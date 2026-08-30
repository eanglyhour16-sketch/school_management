const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "School Management API",
      version: "1.0.0",
      description: "REST API for School Management System",
    },

    servers: [
      {
        url: "http://localhost:8009",
        description: "Local Server",
      },
      {
        url: "https://school-management-sl89.onrender.com",
        description: "Production Server",
      },
    ],
  },

  apis: [
    path.join(__dirname, "../routes/*.js"),
  ],
};

module.exports = swaggerJsdoc(options);