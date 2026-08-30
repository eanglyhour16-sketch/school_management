const express = require("express");

const controller = require("../controllers/grade.controller");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Grades
 *   description: Grade management API
 */

/**
 * @swagger
 * /api/grades:
 *   get:
 *     summary: Get all grades
 *     tags: [Grades]
 *     responses:
 *       200:
 *         description: Successfully retrieved all grades
 *       500:
 *         description: Internal server error
 */
router.get("/", controller.getAll);

/**
 * @swagger
 * /api/grades/{id}:
 *   get:
 *     summary: Get grade by ID
 *     tags: [Grades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Grade MongoDB ObjectId
 *         example: 66c7f1a123456789abcdef12
 *     responses:
 *       200:
 *         description: Successfully retrieved grade
 *       404:
 *         description: Grade not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", controller.getById);

/**
 * @swagger
 * /api/grades:
 *   post:
 *     summary: Create a new grade
 *     tags: [Grades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - grade
 *             properties:
 *               name:
 *                 type: string
 *                 description: Grade name
 *                 example: Grade 10
 *               grade:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 12
 *                 description: Grade number from 1 to 12
 *                 example: 10
 *     responses:
 *       201:
 *         description: Grade created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post("/", controller.create);

/**
 * @swagger
 * /api/grades/{id}:
 *   put:
 *     summary: Update a grade
 *     tags: [Grades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Grade MongoDB ObjectId
 *         example: 66c7f1a123456789abcdef12
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Grade name
 *                 example: Grade 11
 *               grade:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 12
 *                 description: Grade number from 1 to 12
 *                 example: 11
 *     responses:
 *       200:
 *         description: Grade updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Grade not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", controller.update);

/**
 * @swagger
 * /api/grades/{id}:
 *   delete:
 *     summary: Delete a grade
 *     tags: [Grades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Grade MongoDB ObjectId
 *         example: 66c7f1a123456789abcdef12
 *     responses:
 *       200:
 *         description: Grade deleted successfully
 *       404:
 *         description: Grade not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", controller.remove);

module.exports = router;