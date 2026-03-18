import React, { useState, useEffect } from 'react';
import { Download, Upload, FileText, CheckCircle, AlertCircle, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import './Documents.css';

const Documents = () => {
    const templates = [
        { id: 1, name: 'Acceptance Letter Template', type: 'DOCX', size: '24 KB' },
        { id: 2, name: 'Final Evaluation Form', type: 'PDF', size: '156 KB' },
        { id: 3, name: 'Weekly Progress Template', type: 'XLSX', size: '42 KB' },
    ];

    const { user } = useAuth();
    const [issuedLetters, setIssuedLetters] = useState([]);
    const [uploads, setUploads] = useState([]);

    useEffect(() => {
        const savedRequests = JSON.parse(localStorage.getItem('letter_requests') || '[]');
        const myIssued = savedRequests.filter(r => r.studentId === user?.id && r.status === 'issued');
        setIssuedLetters(myIssued);
    }, [user?.id]);

    return (
        <div className="documents-container">
            <div className="documents-header">
                <h1>Document Management</h1>
                <p>Access templates and upload required files.</p>
            </div>

            <div className="documents-grid">
                {issuedLetters.length > 0 && (
                    <section className="doc-section" style={{ gridColumn: '1 / -1' }}>
                        <div className="section-header">
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Award size={20} className="text-emerald-500" />
                                Official Documents
                            </h3>
                            <span className="badge success">Ready for Download</span>
                        </div>
                        <div className="doc-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                            {issuedLetters.map((letter) => (
                                <div key={letter.id} className="doc-card" style={{ border: '1px solid rgba(16, 185, 129, 0.3)', background: 'var(--bg-card)' }}>
                                    <div className="doc-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
                                        <FileText size={24} />
                                    </div>
                                    <div className="doc-info">
                                        <h4 style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>Internship Letter: {letter.company}</h4>
                                        <p>PDF • Issued {letter.dateSubmitted || 'Recently'}</p>
                                    </div>
                                    <button className="download-btn" style={{ color: 'var(--success)', background: 'rgba(16, 185, 129, 0.1)' }}>
                                        <Download size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <section className="doc-section">
                    <h3>Templates & Forms</h3>
                    <div className="doc-list">
                        {templates.map((doc) => (
                            <div key={doc.id} className="doc-card">
                                <div className="doc-icon">
                                    <FileText size={24} />
                                </div>
                                <div className="doc-info">
                                    <h4>{doc.name}</h4>
                                    <p>{doc.type} • {doc.size}</p>
                                </div>
                                <button className="download-btn">
                                    <Download size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="doc-section">
                    <div className="section-header">
                        <h3>My Uploads</h3>
                        <Button variant="outline" size="sm">
                            <Upload size={16} /> Upload New
                        </Button>
                    </div>
                    <div className="upload-list">
                        {uploads.length > 0 ? (
                            uploads.map((file) => (
                                <div key={file.id} className="upload-item">
                                    <FileText size={20} className="file-icon" />
                                    <div className="file-details">
                                        <span className="file-name">{file.name}</span>
                                        <span className="file-date">{file.date}</span>
                                    </div>
                                    <div className={`file-status ${file.status}`}>
                                        <CheckCircle size={16} />
                                        <span>Verified</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state-simple">
                                <p>No documents uploaded yet.</p>
                            </div>
                        )}
                        <div className="upload-placeholder">
                            <div className="upload-dropzone">
                                <Upload size={32} />
                                <p>Drag and drop your offer letter here, or <span>browse</span></p>
                                <small>PDF, JPG, or PNG (Max 5MB)</small>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Documents;
