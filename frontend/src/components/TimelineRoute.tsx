interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

interface TimelineRouteProps {
  locations: Location[];
  optimizedRoute: Location[];
}

export default function TimelineRoute({ locations, optimizedRoute }: TimelineRouteProps) {
  
  const downloadRouteTxt = () => {
    if (optimizedRoute.length === 0) return;
    const txtContent = optimizedRoute.map((loc, idx) => {
      if (idx === 0) return `[XUẤT PHÁT] xuất phát từ: ${loc.name} (Tọa độ: ${loc.lat}, ${loc.lng})`;
      return `[BƯỚC GIAO KHÁCH KHÁCH THỨ ${idx}] ➔ Giao đến bưu kiện: ${loc.name}`;
    });
    txtContent.push(`[HÀNH TRÌNH CUỐI] Vòng quay xe về: TỔNG KHO TRUNG TÂM bàn giao tải.`);

    const blob = new Blob([txtContent.join('\n')], { type: 'text/plain;charset=utf-8' });
    const element = document.createElement('a');
    element.href = URL.createObjectURL(blob);
    element.download = `Danh_Sach_Lo_Trinh_Shipper_${Date.now()}.txt`;
    element.click();
  };

  return (
    <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.02)' }}>
      <div style={{ display: 'flex', justifycontent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '15px', color: '#0f172a', fontWeight: 700 }}>📋 Chỉ dẫn lộ trình tuần tự thông minh:</h3>
        {optimizedRoute.length > 0 && (
          <button onClick={downloadRouteTxt} style={{ padding: '6px 12px', fontSize: '11px', fontWeight: 700, color: '#2563eb', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', cursor: 'pointer' }}>
            💾 Xuất tệp TXT
          </button>
        )}
      </div>

      {locations.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#94a3b8', padding: '24px 0', fontSize: '13px' }}>
          💡 Đang trống dữ liệu hành trình. Hãy ghim điểm khởi tạo trên bản đồ.
        </div>
      ) : optimizedRoute.length === 0 ? (
        <div style={{ padding: '14px', backgroundColor: '#fff7ed', borderRadius: '10px', color: '#c2410c', fontSize: '13px', fontWeight: 500, borderLeft: '4px solid #f97316' }}>
          Hệ thống ghi nhận điểm ghim. Bấm "Lập lộ trình thông minh" để kích hoạt chuỗi tuần tự di chuyển.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '200px', overflowY: 'auto', paddingRight: '4px' }}>
          {optimizedRoute.map((loc, idx) => {
            const isDepot = idx === 0;

            return (
              <div key={loc.id} style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '12px', backgroundColor: isDepot ? '#fff5f5' : '#f8fafc', borderRadius: '12px', border: isDepot ? '1px solid #fee2e2' : '1px solid #f1f5f9' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: isDepot ? '#ef4444' : '#10b981', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800 }}>
                  {isDepot ? "★" : idx}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>
                    {isDepot ? "BƯỚC ĐẦU: XUẤT PHÁT TẠI KHO" : `HÀNH TRÌNH BƯỚC ${idx}: Đến ${loc.name}`}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                    Tọa độ GPS định vị: {loc.lat.toFixed(5)}, {loc.lng.toFixed(5)}
                  </div>
                </div>
              </div>
            );
          })}
          
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '12px', backgroundColor: '#fff5f5', borderRadius: '12px', border: '1px solid #fee2e2' }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: '#ef4444', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800 }}>🏁</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>CUỐI CÙNG: QUAY TRỞ LẠI KHO TRUNG TÂM</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Hoàn tất hành trình giao tải chặng cuối lý tưởng.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}