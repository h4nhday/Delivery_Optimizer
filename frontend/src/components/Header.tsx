interface HeaderProps {
  onOptimize: () => void;
  onClear: () => void;
  loading: boolean;
  hasData: boolean;
  showChart: boolean;
  onToggleChart: () => void;
}

export default function Header({ onOptimize, onClear, loading, hasData, showChart, onToggleChart }: HeaderProps) {
  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      backgroundColor: '#ffffff',
      padding: '18px 28px',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
      border: '1px solid #f1f5f9'
    }}>
      <div>
        <h2 style={{ margin: 0, color: '#0f172a', fontSize: '22px', fontWeight: 800, letterSpacing: '-0.02em' }}>
          ⚡ Delivery Optimizer 
        </h2>
        <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px', fontWeight: 500 }}>
          Hệ thống điều phối & Tối ưu danh mục vận đơn 
        </p>
      </div>
      
      <div style={{ display: 'flex', gap: '12px' }}>
        {hasData && (
          <button
            onClick={onToggleChart}
            style={{
              padding: '10px 18px',
              backgroundColor: showChart ? '#eff6ff' : '#f1f5f9',
              color: showChart ? '#2563eb' : '#475569',
              border: showChart ? '1px solid #bfdbfe' : 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
              transition: 'all 0.2s'
            }}
          >
            {showChart ? '📊 Ẩn đồ thị AI' : '📊 Biểu đồ QTV (GA)'}
          </button>
        )}

        <button
          onClick={onClear}
          disabled={!hasData}
          style={{
            padding: '10px 20px',
            backgroundColor: hasData ? '#fef2f2' : '#f8fafc',
            color: hasData ? '#ef4444' : '#cbd5e1',
            border: 'none',
            borderRadius: '10px',
            cursor: hasData ? 'pointer' : 'not-allowed',
            fontWeight: '600',
            fontSize: '13px',
            transition: 'all 0.2s'
          }}
        >
          🗑️ Xóa toàn bộ
        </button>
        
        <button
          onClick={onOptimize}
          disabled={loading || !hasData}
          style={{
            padding: '10px 24px',
            background: !hasData ? '#e2e8f0' : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            color: !hasData ? '#94a3b8' : '#ffffff',
            border: 'none',
            borderRadius: '10px',
            cursor: !hasData ? 'not-allowed' : 'pointer',
            fontWeight: '700',
            fontSize: '13px',
            boxShadow: !hasData ? 'none' : '0 4px 12px rgba(37, 99, 235, 0.2)',
            transition: 'all 0.2s'
          }}
        >
          {loading ? '🤖 AI đang tính toán...' : '🚀 Lập lộ trình thông minh'}
        </button>
      </div>
    </header>
  );
}