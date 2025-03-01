const mongoose = require("mongoose");

const bayanSchema = new mongoose.Schema({
    fromDate: { type: Date, required: true, index: true },
    toDate: { type: Date, required: true },
    bayans: [
        {
            serialNumber: { type: Number, required: true },
            dayOfTheWeek: { type: String, required: true },
            numericTime: { type: String, required: true },
            kalaiMalai: { type: String, required: true },
            place: { type: String, required: true },
            speaker: { type: String, required: true }
        }
    ]
});

// Auto-increment serial number for bayans inside the array
bayanSchema.pre("save", async function (next) {
    try {
        if (this.bayans && this.bayans.length > 0) {
            const lastBayan = await this.constructor.findOne().sort({ "bayans.serialNumber": -1 }).lean();
            let nextSerialNumber = lastBayan && lastBayan.bayans.length > 0
                ? lastBayan.bayans[lastBayan.bayans.length - 1].serialNumber + 1
                : 1;

            // Assign serial numbers to each bayan
            this.bayans.forEach(bayan => {
                if (!bayan.serialNumber) {
                    bayan.serialNumber = nextSerialNumber++;
                }
            });
        }
        next();
    } catch (error) {
        next(error);
    }
});

// Creating the model
const Bayan = mongoose.model("Bayan", bayanSchema);
module.exports = Bayan;
