const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const { uploadCreative, getCreatives, updateCreative, deleteCreative } = require("../controllers/creativesController");

router.post("/", upload, uploadCreative);
router.get("/", getCreatives);
router.put("/:creativeId", upload, updateCreative);
router.delete("/:creativeId", deleteCreative);

module.exports = router;
