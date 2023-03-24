const express = require('express');
const router = express.Router();

// GET /api/activities/:activityId/routines
router.get("/:activityId/routines", async (req, res, next) => {
// Get a list of all public routines which feature that activity
});

// GET /api/activities
router.get("/", async (req, res, next) => {
// Just return a list of all activities in the database
});

// POST /api/activities
router.post("/", async (req, res, next) => {
// Create a new activity
});

// PATCH /api/activities/:activityId
router.patch("/:activityId", async (req, res, next) => {
// Anyone can update an activity (yes, this could lead to long term problems a la wikipedia)
});

module.exports = router;