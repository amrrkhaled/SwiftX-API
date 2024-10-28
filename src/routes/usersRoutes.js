import express from "express";
import * as usersController from "../controllers/usersController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users or a specific user
 *     description: Retrieve a list of all users. If an ID is provided, retrieve the user with that ID. Only admins and managers can access this endpoint.
 *     operationId: getUsers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *         description: ID of the user to retrieve. If not provided, all users will be returned.
 *     responses:
 *       200:
 *         description: A list of users or a single user object.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       403:
 *         description: Forbidden - Only admins and managers can access this resource.
 *       500:
 *         description: Internal Server Error
 */
router.get("/users", verifyToken, usersController.getUsers);



/**
 * @swagger
 * /users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Add a new user
 *     description: Creates a new user. Only admins and managers can access this endpoint.
 *     operationId: addUser
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, manager, admin]
 *             required:
 *               - username
 *               - password
 *               - role
 *     responses:
 *       201:
 *         description: User created successfully.
 *       403:
 *         description: Forbidden - Only admins can create new users.
 *       500:
 *         description: Internal Server Error
 */
router.post("/users", verifyToken, usersController.addUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user details
 *     description: Updates the details of a user. Only admins and managers can access this endpoint.
 *     operationId: updateUser
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, manager, admin]
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       404:
 *         description: User not found
 *       403:
 *         description: Forbidden - Only admins can update users.
 *       500:
 *         description: Internal Server Error
 */
router.put("/users/:id", verifyToken, usersController.editUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete a user
 *     description: Deletes a user by ID. Only admins and managers can access this endpoint.
 *     operationId: deleteUser
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to delete.
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       404:
 *         description: User not found
 *       403:
 *         description: Forbidden - Only admins can delete users.
 *       500:
 *         description: Internal Server Error
 */
router.delete("/users/:id", verifyToken, usersController.deleteUser);

export default router;
