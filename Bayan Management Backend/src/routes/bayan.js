// E:\Code playground\Languages\Web\Bayan Management\Bayan Management Backend\src\routes\bayan.js
const express = require("express");
const Bayan = require("../models/bayan");
const router = express.Router();
const { verifyToken, restrictTo, restrictDaieeToOwnBayans } = require("../middlewares/authmiddleware");

// Create bayans - Scheduler only
router.post("/", verifyToken, restrictTo("Scheduler"), async (req, res) => {
    try {
        const { fromDate, toDate, bayans } = req.body;
        const startDate = new Date(fromDate);
        const endDate = new Date(toDate);

        if (endDate < startDate) {
            return res.status(400).json({ message: "End date must be greater than or equal to start date" });
        }

        const lastBayan = await Bayan.findOne().sort({ "bayans.serialNumber": -1 }).lean();
        let nextSerialNumber = lastBayan && lastBayan.bayans.length > 0
            ? lastBayan.bayans[lastBayan.bayans.length - 1].serialNumber + 1
            : 1;

        const bayansToCreate = bayans.map((bayan) => ({
            serialNumber: nextSerialNumber++,
            dayOfTheWeek: bayan.dayOfTheWeek,
            numericTime: bayan.numericTime,
            kalaiMalai: bayan.kalaiMalai,
            place: bayan.place,
            speaker: bayan.speaker,
        }));

        if (bayansToCreate.length === 0) {
            return res.status(400).json({ message: "No bayans to save" });
        }

        const bayanDocument = new Bayan({
            fromDate: startDate,
            toDate: endDate,
            bayans: bayansToCreate,
        });

        const createdBayan = await bayanDocument.save();
        console.log("Saved document:", createdBayan);

        const formatDate = (date) => {
            return date.toLocaleDateString("ta-LK", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }).replace(/\//g, "-");
        };

        const formattedDateRange = `${formatDate(startDate)} முதல் ${formatDate(endDate)} வரை பயான்கள்`;
        res.status(201).json({ message: "Bayans created successfully", bayans: createdBayan, formattedDateRange });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating bayans", error: error.message });
    }
});

// GET all bayans - Accessible to both Scheduler and Daiee
router.get("/", verifyToken, async (req, res) => {
    try {
        const bayans = await Bayan.find().sort({ fromDate: 1 });
        if (req.user.role === "Daiee") {
            const user = await require("../models/user").findById(req.user.id);
            const filteredBayans = bayans.map(doc => ({
                ...doc._doc,
                bayans: doc.bayans.filter(bayan => bayan.speaker === user.userName)
            })).filter(doc => doc.bayans.length > 0);
            return res.status(200).json(filteredBayans);
        }
        res.status(200).json(bayans);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching bayans" });
    }
});

// GET a specific bayan by ID - Scheduler or Daiee (own bayans only)
router.get("/:id/bayans/:bayanId", verifyToken, restrictDaieeToOwnBayans, async (req, res) => {
    try {
        const { id, bayanId } = req.params;
        const bayanDoc = await Bayan.findById(id);
        if (!bayanDoc) return res.status(404).json({ message: "Bayan not found" });
        const bayan = bayanDoc.bayans.find((b) => b._id.toString() === bayanId);
        if (!bayan) return res.status(404).json({ message: "Specific bayan not found" });
        res.status(200).json(bayan);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching bayan" });
    }
});

// Update a bayan by id - Scheduler only
router.put("/:id/bayans/:bayanId", verifyToken, restrictTo("Scheduler"), async (req, res) => {
  try {
      const { id, bayanId } = req.params;
      const updateData = req.body;

      // Construct update fields with dot notation
      const updateFields = {};
      for (const key in updateData) {
          updateFields[`bayans.$.${key}`] = updateData[key];
      }

      const updatedBayan = await Bayan.findOneAndUpdate(
          { _id: id, "bayans._id": bayanId },
          { $set: updateFields },
          { new: true }
      );

      if (!updatedBayan) return res.status(404).json({ message: "Bayan not found" });
      res.status(200).json({ message: "Bayan updated successfully", updatedBayan });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating bayan", error: error.message });
  }
});

// Delete a bayan by id - Scheduler only
router.delete("/:id/bayans/:bayanId", verifyToken, restrictTo("Scheduler"), async (req, res) => {
    try {
        const { id, bayanId } = req.params;
        const updatedBayan = await Bayan.findByIdAndUpdate(
            id,
            { $pull: { bayans: { _id: bayanId } } },
            { new: true }
        );
        if (!updatedBayan) return res.status(404).json({ message: "Bayan not found" });
        res.status(200).json({ message: "Bayan deleted successfully", updatedBayan });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting bayan" });
    }
});

// Delete all bayans - Scheduler only
router.delete("/", verifyToken, restrictTo("Scheduler"), async (req, res) => {
    try {
        await Bayan.deleteMany({});
        res.status(200).json({ message: "All bayans cleared successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error clearing bayans", error: error.message });
    }
});

module.exports = router;