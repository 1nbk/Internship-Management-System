const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getNotifications = async (req, res) => {
    try {
        const user = req.user;
        const notifications = [];

        if (user.role === 'ADMIN') {
            // Pending letter requests
            const pendingLetters = await prisma.letterRequest.count({
                where: { status: 'PENDING' }
            });
            if (pendingLetters > 0) {
                notifications.push({
                    id: 'admin_letters',
                    title: 'Pending Letter Requests',
                    message: `${pendingLetters} student(s) waiting for letter approval.`,
                    type: 'warning',
                    link: '/dashboard/admin/letters',
                    time: 'Just now'
                });
            }

            // Unassigned students
            const unassignedStudents = await prisma.user.count({
                where: { role: 'STUDENT', internshipStarted: true, supervisorId: null }
            });
            if (unassignedStudents > 0) {
                notifications.push({
                    id: 'admin_unassigned',
                    title: 'Unassigned Students',
                    message: `${unassignedStudents} active student(s) need a supervisor.`,
                    type: 'info',
                    link: '/dashboard/users',
                    time: 'Action Required'
                });
            }
        } else if (user.role === 'SUPERVISOR') {
            // Pending logbooks meant for this supervisor
            const pendingLogbooks = await prisma.logbook.count({
                where: { supervisorId: user.id, status: 'PENDING' }
            });
            if (pendingLogbooks > 0) {
                notifications.push({
                    id: 'supervisor_logbooks',
                    title: 'Pending Logbooks',
                    message: `You have ${pendingLogbooks} logbook(s) pending review.`,
                    type: 'warning',
                    link: '/dashboard/reviews',
                    time: 'Action Required'
                });
            }
        } else if (user.role === 'STUDENT') {
            // Recent letter updates
            const recentLetters = await prisma.letterRequest.findMany({
                where: { studentId: user.id, status: { in: ['APPROVED', 'REJECTED', 'ISSUED'] } },
                orderBy: { updatedAt: 'desc' },
                take: 2
            });
            recentLetters.forEach(letter => {
                notifications.push({
                    id: `student_letter_${letter.id}`,
                    title: `Letter Request ${letter.status.charAt(0) + letter.status.slice(1).toLowerCase()}`,
                    message: `Your request for ${letter.company} was ${letter.status.toLowerCase()}.`,
                    type: letter.status === 'REJECTED' ? 'error' : 'success',
                    link: '/dashboard/letter-request',
                    time: new Date(letter.updatedAt).toLocaleDateString()
                });
            });

            // Recent logbook updates
            const reviewedLogbooks = await prisma.logbook.findMany({
                where: { studentId: user.id, status: { not: 'PENDING' } },
                orderBy: { updatedAt: 'desc' },
                take: 2
            });
            reviewedLogbooks.forEach(log => {
                 notifications.push({
                    id: `student_logbook_${log.id}`,
                    title: `Logbook Reviewed`,
                    message: `Your logbook for Week ${log.week} was ${log.status.toLowerCase()}.`,
                    type: log.status === 'REJECTED' ? 'warning' : 'success',
                    link: '/dashboard/logbook',
                    time: new Date(log.updatedAt).toLocaleDateString()
                });
            });
        }

        res.json({ success: true, notifications });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ success: false, message: 'Server error fetching notifications' });
    }
};

module.exports = { getNotifications };
