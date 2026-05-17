interface StatsCardProps {
  totalOrders: number;
  distance: number | null;
}

export default function StatsCard({ totalOrders, distance }: StatsCardProps) {
  // Giả lập vận tốc xe máy trung bình trong đô thị là 30km/h => tính ETA thời gian di chuyển
  const estimatedMinutes = distance ? Math.round((distance / 30) * 60 + totalOrders * 5) : 0;
  const hours = Math.floor(estimatedMinutes / 60);
  const mins = estimatedMinutes % 60;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
      <div style={{ backgroundColor: '#ffffff', padding: '18px 24px', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 12px rgba(0,0,0,0.01)' }}>
        <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Vận đơn đã nạp</div>
        <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
          {totalOrders} <span style={{ fontSize: '14px', fontWeight: 500, color: '#94a3b8' }}>kiện hàng</span>
        </div>
      </div>

      <div style={{ backgroundColor: distance ? '#ecfdf5' : '#fff7ed', padding: '18px 24px', borderRadius: '16px', border: distance ? '1px solid #d1fae5' : '1px solid #ffedd5', boxShadow: '0 4px 12px rgba(0,0,0,0.01)', transition: 'all 0.3s' }}>
        <div style={{ fontSize: '11px', color: distance ? '#059669' : '#d97706', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hành trình & ETA</div>
        <div style={{ fontSize: '24px', fontWeight: 800, color: distance ? '#065f46' : '#9a3412', marginTop: '6px' }}>
          {distance ? `${distance.toFixed(1)} km` : '---'}
        </div>
        {distance && (
          <div style={{ fontSize: '12px', color: '#059669', fontWeight: 600, marginTop: '2px' }}>
            ⏳ Dự kiến: {hours > 0 ? `${hours}h ` : ''}${mins}p
          </div>
        )}
      </div>
    </div>
  );
}