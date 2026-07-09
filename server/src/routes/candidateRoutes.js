const express = require("express");
const {
  analyzeResume,
  getAnalyses,
  getAnalysisById,
  deleteAnalysis,
} = require("../controllers/candidateController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.use(protect);

router.post("/analyze", upload.single("resume"), analyzeResume);
router.get("/analyses", getAnalyses);
router.get("/analyses/:id", getAnalysisById);
router.delete("/analyses/:id", deleteAnalysis);

module.exports = router;
