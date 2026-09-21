const express = require("express");
const jwt = require("jsonwebtoken");
const CaregiverAccess = require("./models/CaregiverAccess");

const router = express.Router();

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

/* GET CURRENT CAREGIVER ACCESS */

router.get(
  "/status",
  authenticateToken,
  async (req, res) => {
    try {
      const access = await CaregiverAccess.findOne({
        ownerId: req.userId,
      }).sort({ createdAt: -1 });

      if (!access) {
        return res.json({
          authorized: false,
          access: null,
        });
      }

      res.json({
        authorized: access.status === "authorized",
        access,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to check caregiver access",
      });
    }
  }
);

/* AUTHORIZE CAREGIVER */

router.post(
  "/authorize",
  authenticateToken,
  async (req, res) => {
    try {
      const { caregiverEmail } = req.body;

      if (!caregiverEmail) {
        return res.status(400).json({
          message: "Caregiver email is required",
        });
      }

      const email = caregiverEmail
        .trim()
        .toLowerCase();

      let access = await CaregiverAccess.findOne({
        ownerId: req.userId,
        caregiverEmail: email,
      });

      if (access) {
        access.status = "authorized";
        access.authorizedAt = new Date();
        access.revokedAt = null;

        await access.save();
      } else {
        access = await CaregiverAccess.create({
          ownerId: req.userId,
          caregiverEmail: email,
          status: "authorized",
          authorizedAt: new Date(),
        });
      }

      res.json({
        message: "Caregiver access authorized",
        access,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to authorize caregiver",
      });
    }
  }
);

/* REVOKE CAREGIVER ACCESS */

router.post(
  "/revoke",
  authenticateToken,
  async (req, res) => {
    try {
      const access = await CaregiverAccess.findOne({
        ownerId: req.userId,
        status: "authorized",
      }).sort({ createdAt: -1 });

      if (!access) {
        return res.status(404).json({
          message: "No authorized caregiver found",
        });
      }

      access.status = "revoked";
      access.revokedAt = new Date();

      await access.save();

      res.json({
        message: "Caregiver access revoked",
        access,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to revoke caregiver access",
      });
    }
  }
);

module.exports = router;