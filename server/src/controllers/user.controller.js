const prisma = require('../prisma');

const getAllUsers = async (req, res) => {
    try {
        const { role } = req.query;
        const users = await prisma.user.findMany({
            where: role ? { role } : {},
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                status: true,
                department: true,
                institution: true,
                program: true,
                studentId: true,
                year: true,
                supervisorId: true,
                internshipStarted: true,
                createdAt: true,
                supervisor: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error fetching users' });
    }
};

const assignSupervisor = async (req, res) => {
    try {
        const { studentId, supervisorId } = req.body;

        const updatedStudent = await prisma.user.update({
            where: { id: parseInt(studentId) },
            data: {
                supervisorId: parseInt(supervisorId)
            }
        });

        res.json({
            message: 'Supervisor assigned successfully',
            user: updatedStudent
        });
    } catch (error) {
        console.error('Error assigning supervisor:', error);
        res.status(500).json({ message: 'Internal server error assigning supervisor' });
    }
};

const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id: parseInt(id) },
            data: { status }
        });

        res.json({
            message: 'User status updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ message: 'Internal server error updating user status' });
    }
};

module.exports = {
    getAllUsers,
    assignSupervisor,
    updateUserStatus
};
