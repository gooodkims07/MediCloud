import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PatientList from './components/PatientList';
import MedicalRecord from './components/MedicalRecord';
import PatientRegistration from './components/PatientRegistration';
import ProfileEdit from './components/ProfileEdit';
import Login from './components/Login';
import Signup from './components/Signup';
import { translations } from './translations';
import { supabase } from './supabaseClient';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [session, setSession] = useState(null);
  const [authView, setAuthView] = useState('login'); // 'login' or 'signup'
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);
  const [activePatient, setActivePatient] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem('medicloud_lang') || 'ko');
  const [theme, setTheme] = useState(localStorage.getItem('medicloud_theme') || 'light');

  const [savedRecords, setSavedRecords] = useState(() => {
    const stored = localStorage.getItem('medicloud_records');
    return stored ? JSON.parse(stored) : [];
  });

  const t = translations[language];

  const fetchUserProfile = async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) setUserProfile(data);
  };

  // 인증 상태 감시
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) fetchUserProfile(session.user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) fetchUserProfile(session.user.id);
      else setUserProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 테마 적용
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('medicloud_theme', theme);
  }, [theme]);

  const toggleLanguage = () => {
    const nextLang = language === 'ko' ? 'en' : 'ko';
    setLanguage(nextLang);
    localStorage.setItem('medicloud_lang', nextLang);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // 기록 저장 시 로컬 스토리지 업데이트
  const handleUpdateRecords = (newRecords) => {
    setSavedRecords(newRecords);
    localStorage.setItem('medicloud_records', JSON.stringify(newRecords));
  };

  const handleRecordSelect = (recordId) => {
    setSelectedRecordId(recordId);
    setActiveTab('records');
  };

  const handleEditPatient = (patient) => {
    setEditingPatient(patient);
    setActiveTab('registration');
  };

  const handleStartConsultation = (patient) => {
    setActivePatient(patient);
    setSelectedRecordId(null); // Clear previous record selection for fresh start
    setActiveTab('records');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard language={language} t={t} />;
      case 'patients':
        return (
          <PatientList
            t={t}
            onEditPatient={handleEditPatient}
            onStartConsultation={handleStartConsultation}
          />
        );
      case 'registration':
        return (
          <PatientRegistration
            language={language}
            t={t}
            initialData={editingPatient}
            onRegisterSuccess={() => {
              setEditingPatient(null);
              setActiveTab('patients');
            }}
          />
        );
      case 'records':
        return (
          <MedicalRecord
            activePatient={activePatient}
            savedRecords={filteredRecords}
            setSavedRecords={handleUpdateRecords}
            selectedRecordId={selectedRecordId}
            setSelectedRecordId={setSelectedRecordId}
            language={language}
            t={t}
          />
        );
      default:
        return <Dashboard language={language} t={t} />;
    }
  };

  if (!session) {
    return authView === 'login' ? (
      <Login
        onSwitchToSignup={() => setAuthView('signup')}
        t={t}
      />
    ) : (
      <Signup
        onSwitchToLogin={() => setAuthView('login')}
        t={t}
      />
    );
  }

  const filteredRecords = activePatient
    ? savedRecords.filter(r => r.patientId === activePatient.chart_id)
    : savedRecords;

  return (
    <div style={styles.appContainer}>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab !== 'registration') setEditingPatient(null);
          else if (activeTab !== 'registration') setEditingPatient(null);

          if (tab !== 'records') {
            setActivePatient(null);
          }
          setActiveTab(tab);
        }}
        savedRecords={filteredRecords}
        activePatient={activePatient}
        onRecordClick={handleRecordSelect}
        language={language}
        toggleLanguage={toggleLanguage}
        theme={theme}
        toggleTheme={toggleTheme}
        user={session.user}
        profile={userProfile}
        onEditProfile={() => setIsProfileEditing(true)}
        onLogout={() => supabase.auth.signOut()}
        t={t}
      />
      <main style={styles.main}>
        {renderContent()}
      </main>

      {isProfileEditing && userProfile && (
        <ProfileEdit
          profile={userProfile}
          onSave={() => {
            fetchUserProfile(session.user.id);
            setIsProfileEditing(false);
            alert(t.profile.saveSuccess);
          }}
          onCancel={() => setIsProfileEditing(false)}
          t={t}
        />
      )}
    </div>
  );
}

const styles = {
  appContainer: {
    display: 'flex',
    width: '100%',
    height: '100vh',
  },
  main: {
    flex: 1,
    height: '100vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
};

export default App;
