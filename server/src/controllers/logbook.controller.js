const prisma = require('../prisma');

const submitLogbook = async (req, res) => {
    try {
        const { week, content, skills } = req.body;
        const studentId = req.user.id;

        // Fetch student to get their supervisorId
        const student = await prisma.user.findUnique({ where: { id: studentId } });
        if (!student?.supervisorId) {
            return res.status(400).json({ message: 'No supervisor assigned. Cannot submit logbook.' });
        }

        const newLog = await prisma.logbook.create({
            data: {
                studentId,
                supervisorId: student.supervisorId,
                week,
                content,
                skills: skills || [],
                status: 'PENDING',
                date: new Date().toISOString().split('T')[0]
            }
        });

        res.status(201).json({
            message: 'Logbook submitted successfully',
            log: newLog
        });
    } catch (error) {
        console.error('Error submitting logbook:', error);
        res.status(500).json({ message: 'Internal server error submitting logbook' });
    }
};

const getMyLogs = async (req, res) => {
    try {
        const logs = await prisma.logbook.findMany({
            where: { studentId: req.user.id },
            orderBy: { week: 'desc' }
        });
        res.json(logs);
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getInternsLogs = async (req, res) => {
    try {
        const logs = await prisma.logbook.findMany({
            where: { supervisorId: req.user.id },
            include: {
                student: {
                    select: {
                        name: true,
                        program: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(logs);
    } catch (error) {
        console.error('Error fetching interns logs:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateLogStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, feedback } = req.body;

        const updatedLog = await prisma.logbook.update({
            where: { id: parseInt(id) },
            data: { 
                status,
                feedback: feedback || ''
            }
        });

        res.json({
            message: `Logbook ${status} successfully`,
            log: updatedLog
        });
    } catch (error) {
        console.error('Error updating logbook status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    submitLogbook,
    getMyLogs,
    getInternsLogs,
    updateLogStatus
};
