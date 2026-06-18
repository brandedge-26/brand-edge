import { Job } from "../models/Job.js";

export const getJobs = async (req, res, next) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.json({ success: true, data: jobs });
    } catch (err) {
        next(err);
    }
};

export const createJob = async (req, res, next) => {
    try {
        const { title, department, location, type, level, deadline, description, requirements, status } = req.body;
        const job = await Job.create({ title, department, location, type, level, deadline, description, requirements, status });
        res.status(201).json({ success: true, data: job });
    } catch (err) {
        next(err);
    }
};

export const deleteJob = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await Job.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
};

export const updateJob = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, department, location, type, level, deadline, description, requirements, status } = req.body;
        const job = await Job.findByIdAndUpdate(
            id,
            { title, department, location, type, level, deadline, description, requirements, status },
            { new: true }
        );
        if (!job) return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true, data: job });
    } catch (err) {
        next(err);
    }
};
