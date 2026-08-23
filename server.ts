import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import * as admin from "firebase-admin";
import { getStorage } from "firebase-admin/storage";

// Initialize Firebase Admin lazily
let storage: any;
function getFirebaseStorage() {
  if (!storage) {
    if (!(admin as any).apps.length) {
      admin.initializeApp({
        credential: (admin as any).credential.applicationDefault(),
        storageBucket: "gen-lang-client-0776754138.firebasestorage.app"
      });
    }
    storage = getStorage();
  }
  return storage;
}

const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // API upload route
  app.post("/api/upload", upload.single("file"), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    try {
      const bucket = getFirebaseStorage().bucket();
      const fileName = `uploads/${Date.now()}_${req.file.originalname}`;
      const file = bucket.file(fileName);
      await file.save(req.file.buffer, {
        contentType: req.file.mimetype,
      });
      await file.makePublic();
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      res.json({ url: publicUrl });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Upload failed" });
    }
  });

  // API upload-url route
  app.post("/api/upload-url", async (req, res) => {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "No URL provided" });
    }
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch URL");
      const buffer = Buffer.from(await response.arrayBuffer());
      const bucket = getFirebaseStorage().bucket();
      const fileName = `uploads/${Date.now()}_${path.basename(url)}`;
      const file = bucket.file(fileName);
      await file.save(buffer, {
        contentType: response.headers.get("content-type") || "image/jpeg",
      });
      await file.makePublic();
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      res.json({ url: publicUrl });
    } catch (error) {
      console.error("URL upload error:", error);
      res.status(500).json({ error: "URL upload failed" });
    }
  });

  // API health check route
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, __dirname is the directory of server.cjs (which is /dist)
    const distPath = __dirname;
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
