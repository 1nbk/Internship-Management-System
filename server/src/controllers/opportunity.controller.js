const prisma = require('../prisma');

const createOpportunity = async (req, res) => {
    try {
        const { title, company, location, type, description } = req.body;
        const newOpportunity = await prisma.internshipOpportunity.create({
            data: { title, company, location, type, description }
        });
        res.status(201).json(newOpportunity);
    } catch (error) {
        console.error('Error creating opportunity:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getOpportunities = async (req, res) => {
    try {
        const opportunities = await prisma.internshipOpportunity.findMany({
            where: { status: 'OPEN' },
            orderBy: { createdAt: 'desc' }
        });
        res.json(opportunities);
    } catch (error) {
        console.error('Error fetching opportunities:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const applyToOpportunity = async (req, res) => {
    try {
        const { opportunityId } = req.body;
        const studentId = req.user.id;

        // Check for existing application
        const existing = await prisma.application.findFirst({
            where: { opportunityId, studentId }
        });

        if (existing) {
            return res.status(400).json({ message: 'You have already applied to this internship' });
        }

        const application = await prisma.application.create({
            data: { opportunityId, studentId }
        });

        res.status(201).json({ message: 'Application submitted', application });
    } catch (error) {
        console.error('Error applying:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getAllApplications = async (req, res) => {
    try {
        const applications = await prisma.application.findMany({
            include: {
                student: { select: { id: true, name: true, email: true, program: true } },
                opportunity: true
            },
            orderBy: { dateSubmitted: 'desc' }
        });
        res.json(applications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updated = await prisma.application.update({
            where: { id: parseInt(id) },
            data: { status }
        });

        res.json({ message: `Application ${status}`, application: updated });
    } catch (error) {
        console.error('Error updating application:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateOpportunity = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updated = await prisma.internshipOpportunity.update({
            where: { id: parseInt(id) },
            data: updates
        });
        res.json(updated);
    } catch (error) {
        console.error('Error updating opportunity:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteOpportunity = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.internshipOpportunity.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Opportunity deleted successfully' });
    } catch (error) {
        console.error('Error deleting opportunity:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createOpportunity,
    getOpportunities,
    applyToOpportunity,
    getAllApplications,
    updateApplicationStatus,
    updateOpportunity,
    deleteOpportunity
};
