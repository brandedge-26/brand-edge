import { DailyReport } from "../models/DailyReport.js";

export const upsertMyReport = async (req, res, next) => {
    try {
        const { date, callsMade, interestedCount, notes } = req.body;
        const report = await DailyReport.findOneAndUpdate(
            { salesRep: req.salesRep.salesRepId, date },
            { callsMade, interestedCount, notes },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        res.json({ success: true, data: report });
    } catch (err) {
        next(err);
    }
};

export const getMyReports = async (req, res, next) => {
    try {
        const reports = await DailyReport.find({ salesRep: req.salesRep.salesRepId }).sort({ date: -1 });
        res.json({ success: true, data: reports });
    } catch (err) {
        next(err);
    }
};
