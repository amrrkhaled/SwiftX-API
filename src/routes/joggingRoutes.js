import express from "express";
import * as joggingController from "../controllers/joggingController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
const router = express.Router();

/**
 * @swagger
 * /jogging:
 *   post:
 *     tags:
 *       - Jogging
 *     summary: Add Jogging Record
 *     description: Creates a new jogging record for the authenticated user.
 *     operationId: addJoggingRecord
 *     security:
 *       - bearerAuth: []  # This assumes JWT Bearer token authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               datjogginge:
 *                 type: string
 *                 format: date
 *                 example: "2023-10-23"
 *               time:
 *                 type: string
 *                 example: "00:30"
 *               distance:
 *                 type: number
 *                 example: 5
 *     responses:
 *       201:
 *         description: Jogging record created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Jogging record created successfully."
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

router.post("/jogging", verifyToken, joggingController.addJog);
/**
 * @swagger
 * /allJoggings:
 *   get:
 *     tags:
 *       - Jogging
 *     summary: View jogging records
 *     description: View all jogging records for the authenticated user. Admins can view all records, while other users see only their own.
 *     operationId: viewJogging
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: from
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date filter for jogging records.
 *       - name: to
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: End date filter for jogging records.
 *     responses:
 *       200:
 *         description: List of jogging records.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/JoggingRecord'
 *       500:
 *         description: Internal Server Error
 */

router.get("/allJoggings", verifyToken, joggingController.viewJogs);
/**
 * @swagger
 * /report:
 *   get:
 *     tags:
 *       - Jogging
 *     summary: Weekly jogging report
 *     description: Generate weekly report for average distance and speed based on jogging records for the authenticated user.
 *     operationId: joggingReport
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Weekly jogging report.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   year:
 *                     type: integer
 *                   week:
 *                     type: integer
 *                   avg_distance:
 *                     type: number
 *                   avg_speed:
 *                     type: number
 *       500:
 *         description: Internal Server Error
 */

router.get("/report", verifyToken, joggingController.jogsReport);
/**
 * @swagger
 * /jogging/{id}:
 *   put:
 *     tags:
 *       - Jogging
 *     summary: Update jogging record
 *     description: Update the jogging record with the given ID for the authenticated user. Admins can update any record.
 *     operationId: updateJogging
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Jogging record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               time:
 *                 type: string
 *                 example: "00:30"
 *               distance:
 *                 type: number
 *     responses:
 *       200:
 *         description: Jogging record updated successfully
 *       404:
 *         description: Jogging record not found
 *       500:
 *         description: Internal Server Error
 */
router.put("/jogging/:id", verifyToken, joggingController.editJog);
/**
 * @swagger
 * /jogging/{id}:
 *   delete:
 *     tags:
 *       - Jogging
 *     summary: Delete jogging record
 *     description: Delete the jogging record with the given ID for the authenticated user. Admins can delete any record.
 *     operationId: deleteJogging
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Jogging record ID
 *     responses:
 *       200:
 *         description: Jogging record deleted successfully
 *       404:
 *         description: Jogging record not found
 *       500:
 *         description: Internal Server Error
 */
router.delete("/jog", verifyToken, joggingController.deleteJog);

export default router;
