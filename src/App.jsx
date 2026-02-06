import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PatientList from './components/PatientList';
import PatientRegistration from './components/PatientRegistration';
import MedicalRecord from './components/MedicalRecord';

// 초기 더미 데이터
const initialPatients = [
    { id: 'P001', name: '김지아', gender: 'female', birthDate: '1996-05-15', phone: '010-1234-5678', address: '서울특별시 강남구 테헤란로 123', detailAddress: '101동 1001호', zipCode: '06234', lastVisit: '2024-01-20' },
    { id: 'P002', name: '이민수', gender: 'male', birthDate: '1979-08-22', phone: '010-9876-5432', address: '서울특별시 서초구 반포대로 45', detailAddress: '202동 502호', zipCode: '06578', lastVisit: '2024-01-28' },
    { id: 'P003', name: '박철수', gender: 'male', birthDate: '1992-03-10', phone: '010-5555-4444', address: '경기도 성남시 분당구 판교역로 166', detailAddress: '판교타워 15층', zipCode: '13529', lastVisit: '2024-01-15' },
    { id: 'P004', name: '최유진', gender: 'female', birthDate: '1985-11-30', phone: '010-8888-7777', address: '서울특별시 마포구 홍대입구역로 12', detailAddress: '3층', zipCode: '04066', lastVisit: '2024-01-10' },
    { id: 'P005', name: '정현우', gender: 'male', birthDate: '1972-07-08', phone: '010-2222-3333', address: '인천광역시 연수구 센트럴로 194', detailAddress: '송도타워 2201호', zipCode: '21984', lastVisit: '2024-01-05' },
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [patients, setPatients] = useState(() => {
    const saved = localStorage.getItem('medicloud_patients');
    return saved ? JSON.parse(saved) : initialPatients;
  });
  const [editingPatient, setEditingPatient] = useState(null);

  // 환자 데이터 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('medicloud_patients', JSON.stringify(patients));
  }, [patients]);

  // 새 차트 ID 생성
  const generateChartId = () => {
    const maxNum = patients.reduce((max, p) => {
      const num = parseInt(p.id.replace('P', '')) || 0;
      return num > max ? num : max;
    }, 0);
    return 'P' + String(maxNum + 1).padStart(3, '0');
  };

  // 환자 등록
  const handleRegisterPatient = (patientData) => {
    const newPatient = {
      ...patientData,
      id: generateChartId(),
      lastVisit: new Date().toISOString().split('T')[0],
    };
    setPatients([...patients, newPatient]);
    setActiveTab('patients');
  };

  // 환자 수정
  const handleUpdatePatient = (patientData) => {
    setPatients(patients.map(p => p.id === patientData.id ? { ...p, ...patientData } : p));
    setEditingPatient(null);
    setActiveTab('patients');
  };

  // 환자 삭제
  const handleDeletePatient = (patientId) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setPatients(patients.filter(p => p.id !== patientId));
    }
  };

  // 환자 상세/수정 보기
  const handleEditPatient = (patient) => {
    setEditingPatient(patient);
    setActiveTab('edit');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard patientCount={patients.length} />;
      case 'patients':
        return (
          <PatientList 
            patients={patients}
            onAddPatient={() => setActiveTab('register')} 
            onEditPatient={handleEditPatient}
            onDeletePatient={handleDeletePatient}
          />
        );
      case 'register':
        return (
          <PatientRegistration 
            onBack={() => setActiveTab('patients')} 
            onSave={handleRegisterPatient}
          />
        );
      case 'edit':
        return (
          <PatientRegistration 
            initialData={editingPatient}
            onBack={() => { setEditingPatient(null); setActiveTab('patients'); }} 
            onSave={handleUpdatePatient}
          />
        );
      case 'records':
        return <MedicalRecord />;
      default:
        return <Dashboard patientCount={patients.length} />;
    }
  };

  return (
    <>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main style={styles.main}>
        {renderContent()}
      </main>
    </>
  );
}

const styles = {
  main: {
    flex: 1,
    height: '100vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
};

export default App;
