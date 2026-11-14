import { Contact } from "../models/Contact.js";
import { Consultation } from "../models/Consultation.js";
import { CallLog } from "../models/CallLog.js";

export const getStatsForRep = async (salesRepId, { from, to } = {}) => {
    const callFilter = { calledBy: salesRepId };
    if (from || to) {
        callFilter.calledAt = {};
        if (from) callFilter.calledAt.$gte = new Date(from);
        if (to) {
            const toDate = new Date(to);
            toDate.setHours(23, 59, 59, 999);
            callFilter.calledAt.$lte = toDate;
        }
    }

    const [callsCount, followUpsCount, contactsAssigned, consultationsAssigned, contactsConverted, consultationsConverted] = await Promise.all([
        CallLog.countDocuments(callFilter),
        CallLog.countDocuments({ ...callFilter, wasFollowUp: true }),
        Contact.countDocuments({ assignedTo: salesRepId }),
        Consultation.countDocuments({ assignedTo: salesRepId }),
        Contact.countDocuments({ assignedTo: salesRepId, salesStatus: "Converted" }),
        Consultation.countDocuments({ assignedTo: salesRepId, salesStatus: "Converted" }),
    ]);

    return {
        callsCount,
        followUpsCount,
        leadsAssignedCount: contactsAssigned + consultationsAssigned,
        conversionsCount: contactsConverted + consultationsConverted,
    };
};
