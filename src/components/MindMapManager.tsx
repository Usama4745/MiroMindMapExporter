'use client';
import {FC, useState} from 'react';
import {Export} from './Export';
import {Import} from './Import';

type Tab = 'export' | 'import';

export const MindMapManager: FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('export');

  return (
    <div style={{height: '100vh', display: 'flex', flexDirection: 'column'}}>
      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        borderBottom: '2px solid #e0e0e0',
        backgroundColor: '#f8f9fa'
      }}>
        <button
          onClick={() => setActiveTab('export')}
          style={{
            flex: 1,
            padding: '16px',
            border: 'none',
            backgroundColor: activeTab === 'export' ? '#ffffff' : 'transparent',
            borderBottom: activeTab === 'export' ? '3px solid #4262ff' : '3px solid transparent',
            color: activeTab === 'export' ? '#4262ff' : '#6c757d',
            fontWeight: activeTab === 'export' ? 'bold' : 'normal',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.3s ease',
          }}
        >
          Export Mind Map
        </button>
        <button
          onClick={() => setActiveTab('import')}
          style={{
            flex: 1,
            padding: '16px',
            border: 'none',
            backgroundColor: activeTab === 'import' ? '#ffffff' : 'transparent',
            borderBottom: activeTab === 'import' ? '3px solid #4262ff' : '3px solid transparent',
            color: activeTab === 'import' ? '#4262ff' : '#6c757d',
            fontWeight: activeTab === 'import' ? 'bold' : 'normal',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.3s ease',
          }}
        >
          Import Mind Map
        </button>
      </div>

      {/* Tab Content */}
      <div style={{flex: 1, overflow: 'auto', padding: '0'}}>
        {activeTab === 'export' && <Export />}
        {activeTab === 'import' && <Import />}
      </div>
    </div>
  );
};
