import React, { useState } from 'react';

const PatientRegistration = ({ onBack, onRegisterSuccess }) => {
    const [name, setName] = useState('');
    const [gender, setGender] = useState('male');
    const [birthDate, setBirthDate] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [detailAddress, setDetailAddress] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAddressSearch = () => {
        new window.daum.Postcode({
            oncomplete: function(data) {
                let fullAddr = data.address;
                let extraAddr = '';

                if (data.addressType === 'R') {
                    if (data.bname !== '') extraAddr += data.bname;
                    if (data.buildingName !== '') extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                    fullAddr += (extraAddr !== '' ? ' (' + extraAddr + ')' : '');
                }

                setAddress(fullAddr);
                setZipCode(data.zonecode);
                
                setTimeout(() => {
                    document.getElementById("detailAddress")?.focus();
                }, 100);
            }
        }).open();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const patientData = {
            id: 'P' + String(Date.now()).slice(-6),
            name,
            gender,
            birthDate,
            phone,
            address,
            detailAddress,
            zipCode,
            createdAt: new Date().toISOString(),
        };

        // TODO: DB 연동 시 Supabase insert 추가
        console.log('Patient Data:', patientData);
        
        alert('환자 등록이 완료되었습니다!');
        setLoading(false);
        
        if (onRegisterSuccess) onRegisterSuccess();
        if (onBack) onBack();
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <header style={styles.header}>
                    <div style={styles.headerTop}>
                        <button style={styles.backBtn} onClick={onBack}>← 뒤로</button>
                    </div>
                    <h2 style={styles.title}>신규 환자 등록</h2>
                    <p style={styles.subtitle}>환자 정보를 입력해 주세요</p>
                </header>

                <form style={styles.form} onSubmit={handleSubmit}>
                    <div style={styles.inputGrid}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>성함 *</label>
                            <input
                                type="text"
                                style={styles.input}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="홍길동"
                                required
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>성별 *</label>
                            <select
                                style={styles.select}
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                required
                            >
                                <option value="male">남성</option>
                                <option value="female">여성</option>
                                <option value="other">기타</option>
                            </select>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>생년월일 *</label>
                            <input
                                type="date"
                                style={styles.input}
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                required
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>연락처</label>
                            <input
                                type="tel"
                                placeholder="010-0000-0000"
                                style={styles.input}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>

                        <div style={styles.inputGroupFull}>
                            <label style={styles.label}>주소</label>
                            <div style={styles.addressRow}>
                                <input
                                    type="text"
                                    style={{...styles.input, flex: 1, maxWidth: '150px'}}
                                    value={zipCode}
                                    placeholder="우편번호"
                                    readOnly
                                />
                                <button 
                                    type="button" 
                                    onClick={handleAddressSearch} 
                                    style={styles.addressBtn}
                                >
                                    🔍 주소 찾기
                                </button>
                            </div>
                            <input
                                type="text"
                                style={{...styles.input, marginTop: '0.5rem'}}
                                value={address}
                                placeholder="도로명 주소"
                                readOnly
                            />
                            <input
                                id="detailAddress"
                                type="text"
                                style={{...styles.input, marginTop: '0.5rem'}}
                                value={detailAddress}
                                onChange={(e) => setDetailAddress(e.target.value)}
                                placeholder="상세 주소를 입력하세요 (동/호수 등)"
                            />
                        </div>
                    </div>

                    <div style={styles.buttonRow}>
                        <button type="button" style={styles.cancelBtn} onClick={onBack}>
                            취소
                        </button>
                        <button type="submit" style={styles.submitBtn} disabled={loading}>
                            {loading ? '등록 중...' : '환자 등록'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '2rem',
        flex: 1,
        backgroundColor: '#f8fafc',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        overflowY: 'auto',
    },
    card: {
        width: '100%',
        maxWidth: '700px',
        backgroundColor: 'white',
        padding: '2.5rem',
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0',
    },
    header: {
        marginBottom: '2rem',
    },
    headerTop: {
        marginBottom: '1rem',
    },
    backBtn: {
        background: 'none',
        border: 'none',
        color: '#64748b',
        fontSize: '0.9rem',
        cursor: 'pointer',
        padding: '0.5rem 0',
        fontWeight: '500',
    },
    title: {
        fontSize: '1.75rem',
        fontWeight: '800',
        color: '#1e293b',
        letterSpacing: '-0.025em',
    },
    subtitle: {
        fontSize: '0.95rem',
        color: '#64748b',
        marginTop: '0.4rem',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
    },
    inputGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1.5rem',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    inputGroupFull: {
        gridColumn: 'span 2',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    label: {
        fontSize: '0.85rem',
        fontWeight: '600',
        color: '#475569',
    },
    input: {
        padding: '0.875rem 1rem',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        backgroundColor: '#fff',
        color: '#1e293b',
        fontSize: '0.95rem',
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
    },
    select: {
        padding: '0.875rem 1rem',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        backgroundColor: '#fff',
        color: '#1e293b',
        fontSize: '0.95rem',
        outline: 'none',
        cursor: 'pointer',
    },
    addressRow: {
        display: 'flex',
        gap: '0.75rem',
        alignItems: 'center',
    },
    addressBtn: {
        padding: '0.875rem 1.25rem',
        backgroundColor: '#0d9488',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontSize: '0.9rem',
        fontWeight: '600',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'background-color 0.2s',
    },
    buttonRow: {
        display: 'flex',
        gap: '1rem',
        justifyContent: 'flex-end',
        paddingTop: '1rem',
        borderTop: '1px solid #e2e8f0',
    },
    cancelBtn: {
        padding: '1rem 2rem',
        backgroundColor: '#f1f5f9',
        color: '#64748b',
        border: 'none',
        borderRadius: '10px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
    },
    submitBtn: {
        padding: '1rem 2rem',
        backgroundColor: '#0d9488',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontSize: '1rem',
        fontWeight: '700',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)',
        transition: 'transform 0.2s, background-color 0.2s',
    },
};

export default PatientRegistration;
