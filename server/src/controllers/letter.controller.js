const prisma = require('../prisma');

const createLetterRequest = async (req, res) => {
    try {
        const { company, companyAddress, startDate, endDate } = req.body;
        const studentId = req.user.id;

        const newRequest = await prisma.letterRequest.create({
            data: {
                studentId,
                company,
                companyAddress,
                startDate,
                endDate,
                status: 'PENDING'
            }
        });

        res.status(201).json({
            message: 'Letter request submitted successfully',
            request: newRequest
        });
    } catch (error) {
        console.error('Error creating letter request:', error);
        res.status(500).json({ message: 'Internal server error creating letter request' });
    }
};

const getAllLetterRequests = async (req, res) => {
    try {
        const requests = await prisma.letterRequest.findMany({
            include: {
                student: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        program: true
                    }
                }
            },
            orderBy: {
                dateSubmitted: 'desc'
            }
        });
        res.json(requests);
    } catch (error) {
        console.error('Error fetching letter requests:', error);
        res.status(500).json({ message: 'Internal server error fetching letter requests' });
    }
};

const updateLetterRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedRequest = await prisma.letterRequest.update({
            where: { id: parseInt(id) },
            data: { status }
        });

        res.json({
            message: `Letter request ${status} successfully`,
            request: updatedRequest
        });
    } catch (error) {
        console.error('Error updating letter request status:', error);
        res.status(500).json({ message: 'Internal server error updating letter request status' });
    }
};

const getMyAppRequest = async (req, res) => {
    try {
        const requests = await prisma.letterRequest.findMany({
            where: { studentId: req.user.id },
            orderBy: { dateSubmitted: 'desc' }
        });
        res.json(requests);
    } catch (error) {
        console.error('Error fetching my requests:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createLetterRequest,
    getAllLetterRequests,
    updateLetterRequestStatus,
    getMyAppRequest
};
