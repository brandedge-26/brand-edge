import { getStatsForRep } from "../utils/salesStats.js";

export const getMyDashboard = async (req, res, next) => {
    try {
        const { from, to } = req.query;
        const stats = await getStatsForRep(req.salesRep.salesRepId, { from, to });
        res.json({ success: true, data: stats });
    } catch (err) {
        next(err);
    }
};
