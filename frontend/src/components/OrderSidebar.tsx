import { useState } from 'react';

interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status?: 'pending' | 'completed' | 'cancelled';
}

interface OrderSidebarProps {
  locations: Location[];
  onUpdateStatus: (id: string, status: 'pending' | 'completed' | 'cancelled') => void;
}

export default function OrderSidebar({ locations, onUpdateStatus }: OrderSidebarProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const filteredOrders = locations.filter((loc, idx) => {
    if (idx === 0) return false; // Loại bỏ tổng kho ra khỏi danh mục lọc
    const matchesSearch = loc.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || (loc.status || 'pending') === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.02)' }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#0f172a', fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>📦 Danh mục bưu kiện đơn gốc</span>
        <span style={{ fontSize: '12px', backgroundColor: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '20px' }}>
          {locations.length - 1 > 0 ? locations.length - 1 : 0} đơn
        </span>
      </h3>

      <input
        type="text"
        placeholder="🔍 Tìm nhanh bưu tá hoặc mã đơn..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '13px', marginBottom: '12px', outline: 'none', boxSizing: 'border-box' }}
      />

      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
        {(['all', 'pending', 'completed'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            style={{
              flex: 1, padding: '8px', fontSize: '12px', fontWeight: 600, border: 'none', borderRadius: '8px', cursor: 'pointer',
              backgroundColor: filter === type ? '#0f172a' : '#f1f5f9',
              color: filter === type ? '#ffffff' : '#64748b', transition: 'all 0.2s'
            }}
          >
            {type === 'all' ? 'Tất cả' : type === 'pending' ? '⏳ Chờ giao' : '✅ Đã giao'}
          </button>
        ))}
      </div>

      <div style={{ maxHeight: '160px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredOrders.length === 0 ? (
          <div style={{ textAlign: 'center', fontSize: '13px', color: '#94a3b8', padding: '20px 0' }}>Không tìm thấy đơn hàng thích hợp.</div>
        ) : (
          filteredOrders.map((loc) => {
            const currentStatus = loc.status || 'pending';
            const originalIdx = locations.findIndex(p => p.id === loc.id);
            return (
              <div key={loc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>Đơn hàng số #{originalIdx}</span>
                <select
                  value={currentStatus}
                  onChange={(e) => onUpdateStatus(loc.id, e.target.value as any)}
                  style={{
                    padding: '6px 10px', fontSize: '12px', fontWeight: 600, borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', cursor: 'pointer',
                    backgroundColor: currentStatus === 'completed' ? '#d1fae5' : currentStatus === 'cancelled' ? '#fee2e2' : '#eff6ff',
                    color: currentStatus === 'completed' ? '#065f46' : currentStatus === 'cancelled' ? '#991b1b' : '#1e40af'
                  }}
                >
                  <option value="pending">⏳ Đang chờ</option>
                  <option value="completed">✅ Giao xong</option>
                  <option value="cancelled">❌ Khách hủy</option>
                </select>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}