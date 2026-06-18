import { Notification } from "../models/Notification.js";

export const getNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 });
        res.json({ success: true, data: notifications });
    } catch (err) {
        next(err);
    }
};

export const markRead = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updated = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
        if (!updated) return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true, data: updated });
    } catch (err) {
        next(err);
    }
};

export const markAllRead = async (req, res, next) => {
    try {
        await Notification.updateMany({ read: false }, { read: true });
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
};

export const deleteNotification = async (req, res, next) => {
    try {
        const { id } = req.params;
        await Notification.findByIdAndDelete(id);
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
};
