import React, { useState } from 'react';

const PatientList = ({ patients, onAddPatient, onEditPatient, onDeletePatient }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // 나이 계산
    const calculateAge = (birthDate) => {
        if (!birthDate) return '-';
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    // 성별 표시
    const getGenderDisplay = (gender) => {
        switch (gender) {
            case 'male': return '남';
            case 'female': return '여';
            default: return '-';
        }
    };

    const filteredPatients = patients.filter(p => 
        p.name.includes(searchTerm) || p.id.includes(searchTerm) || p.phone.includes(searchTerm)
    );

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h2 style={styles.title}>환자 관리</h2>
                <div style={styles.actions}>
                    <div style={styles.searchWrapper}>
                        <span style={styles.searchIcon}>🔍</span>
                        <input
                            type="text"
                            placeholder="환자명, 차트번호, 연락처 검색"
                            style={styles.searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button style={styles.addButton} onClick={onAddPatient}>+ 새 환자 등록</button>
                </div>
            </header>

            <div style={styles.card}>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.tableHeader}>
                            <th style={styles.th}>차트 번호</th>
                            <th style={styles.th}>성함</th>
                            <th style={styles.th}>성별/나이</th>
                            <th style={styles.th}>연락처</th>
                            <th style={styles.th}>주소</th>
                            <th style={styles.th}>최근 내원일</th>
                            <th style={styles.th}>관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPatients.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={styles.emptyRow}>
                                    {searchTerm ? '검색 결과가 없습니다.' : '등록된 환자가 없습니다.'}
                                </td>
                            </tr>
                        ) : (
                            filteredPatients.map((patient) => (
                                <tr 
                                    key={patient.id} 
                                    style={styles.tableRow}
                                    onClick={() => onEditPatient(patient)}
                                >
                                    <td style={{ ...styles.td, fontWeight: '600', color: 'var(--primary-color)' }}>
                                        {patient.id}
                                    </td>
                                    <td style={styles.td}>{patient.name}</td>
                                    <td style={styles.td}>
                                        {getGenderDisplay(patient.gender)} / {calculateAge(patient.birthDate)}세
                                    </td>
                                    <td style={styles.td}>{patient.phone || '-'}</td>
                                    <td style={{...styles.td, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                                        {patient.address || '-'}
                                    </td>
                                    <td style={styles.td}>{patient.lastVisit || '-'}</td>
                                    <td style={styles.td}>
                                        <button 
                                            style={styles.actionBtn}
                                            onClick={(e) => { e.stopPropagation(); onEditPatient(patient); }}
                                        >
                                            ✏️ 수정
                                        </button>
                                        <button 
                                            style={{ ...styles.actionBtn, color: '#ef4444' }}
                                            onClick={(e) => { e.stopPropagation(); onDeletePatient(patient.id); }}
                                        >
                                            🗑️ 삭제
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            
            <div style={styles.footer}>
                총 <strong>{filteredPatients.length}</strong>명의 환자
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '2rem',
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
    },
    title: {
        fontSize: '1.875rem',
        fontWeight: '700',
    },
    actions: {
        display: 'flex',
        gap: '1rem',
    },
    searchWrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
    },
    searchIcon: {
        position: 'absolute',
        left: '12px',
        color: 'var(--text-muted)',
    },
    searchInput: {
        padding: '0.625rem 1rem 0.625rem 2.5rem',
        borderRadius: '8px',
        border: '1px solid var(--border-color)',
        width: '300px',
        fontSize: '0.9rem',
        outline: 'none',
    },
    addButton: {
        padding: '0.625rem 1.25rem',
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    card: {
        backgroundColor: 'var(--card-bg)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow)',
        overflow: 'hidden',
        flex: 1,
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    tableHeader: {
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid var(--border-color)',
    },
    th: {
        textAlign: 'left',
        padding: '1rem',
        fontSize: '0.875rem',
        color: 'var(--text-muted)',
        fontWeight: '600',
    },
    tableRow: {
        borderBottom: '1px solid #f1f5f9',
        transition: 'background-color 0.2s',
        cursor: 'pointer',
    },
    td: {
        padding: '1rem',
        fontSize: '0.9rem',
    },
    emptyRow: {
        padding: '3rem',
        textAlign: 'center',
        color: '#94a3b8',
        fontSize: '0.95rem',
    },
    actionBtn: {
        background: 'none',
        border: 'none',
        color: 'var(--primary-color)',
        fontWeight: '600',
        cursor: 'pointer',
        marginRight: '0.75rem',
        fontSize: '0.85rem',
        padding: '0.25rem 0.5rem',
        borderRadius: '4px',
        transition: 'background-color 0.2s',
    },
    footer: {
        marginTop: '1rem',
        padding: '0.75rem',
        textAlign: 'right',
        color: '#64748b',
        fontSize: '0.9rem',
    },
};

export default PatientList;
