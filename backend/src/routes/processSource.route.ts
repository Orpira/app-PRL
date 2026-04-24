import express from "express";
import multer from "multer";
import { processSource } from "../controllers/processSource.controller";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
});

router.post("/process-source", upload.single("file"), processSource);

export default router;