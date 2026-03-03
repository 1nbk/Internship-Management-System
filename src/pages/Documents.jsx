import React from 'react';
import { Download, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../components/Button';
import './Documents.css';

const Documents = () => {
    const templates = [
        { id: 1, name: 'Acceptance Letter Template', type: 'DOCX', size: '24 KB' },
        { id: 2, name: 'Final Evaluation Form', type: 'PDF', size: '156 KB' },
        { id: 3, name: 'Weekly Progress Template', type: 'XLSX', size: '42 KB' },
    ];

    const uploads = [
        { id: 1, name: 'Signed Offer Letter.pdf', date: 'Oct 12, 2025', status: 'verified' },
        { id: 2, name: 'ID Copy.jpg', date: 'Oct 10, 2025', status: 'verified' },
    ];

    return (
        <div className="documents-container">
            <div className="documents-header">
                <h1>Document Management</h1>
                <p>Access templates and upload required files.</p>
            </div>

            <div className="documents-grid">
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
                        {uploads.map((file) => (
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
                        ))}
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
