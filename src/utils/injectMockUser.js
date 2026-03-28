const mockUser = {
    id: 1,
    name: "Test Student",
    email: "student@test.com",
    role: "STUDENT",
    institution: "IMS Institute",
    program: "Computer Science",
    studentId: "IMS-2024-001",
    year: "300",
    phone: "+233 12 345 6789",
    skills: ["React", "JavaScript", "Node.js", "UI Design"],
    bio: "Passionate developer looking for internship opportunities.",
    linkedin: "https://linkedin.com/in/teststudent",
    github: "https://github.com/teststudent"
};

localStorage.setItem('ims_user', JSON.stringify(mockUser));
localStorage.setItem('ims_token', 'mock_token_for_testing');
console.log('Mock user injected into localStorage');
