import { useState } from 'react';
import Header from './components/Header';
import StatsCard from './components/StatsCard';
import OrderSidebar from './components/OrderSidebar';
import TimelineRoute from './components/TimelineRoute';
import MapView from './components/MapView';
import FitnessChart from './components/FitnessChart';

interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status?: 'pending' | 'completed' | 'cancelled';
}

export default function App() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [optimizedRoute, setOptimizedRoute] = useState<Location[]>([]);
  const [roadGeometry, setRoadGeometry] = useState<[number, number][]>([]);
  const [fitnessHistory, setFitnessHistory] = useState<number[]>([]);
  const [distance, setDistance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [showChart, setShowChart] = useState(false);

  const handleMapClick = (lat: number, lng: number) => {
    const isDepot = locations.length === 0;
    const newLocation: Location = {
      id: `loc-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: isDepot ? 'TỔNG KHO TRUNG TÂM' : `Đơn hàng số ${locations.length}`,
      lat,
      lng,
      status: 'pending'
    };
    setLocations([...locations, newLocation]);
  };

  const handleOptimize = async () => {
    if (locations.length < 3) {
      alert('Vui lòng chọn tối thiểu 1 tổng kho (điểm đầu tiên) và từ 2 Đơn hàng trở lên để lập lộ trình!');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(locations)
      });
      
      if (!response.ok) {
        throw new Error(`Server báo lỗi trạng thái: ${response.status}`);
      }

      const data = await response.json();
      
      // 👉 SỬA ĐIỀU KIỆN TẠI ĐÂY: Chỉ cần có mảng 'route' hoặc 'success === true' là duyệt luôn
      if (data && (data.success === true || data.route)) {
        setOptimizedRoute(data.route || []);
        setDistance(data.distance || 0);
        setFitnessHistory(data.fitnessHistory || []);
        setRoadGeometry(data.roadGeometry || []);
        
        if (data.isFallback) {
          alert('💡 Thông báo: Máy chủ OSRM quốc tế hiện tại đang bận. Hệ thống đã tự động chuyển sang cơ chế dự phòng Haversine.');
        }
      } else {
        alert(`❌ Thuật toán thất bại: ${data.error || 'Phản hồi từ Server không đúng định dạng!'}`);
      }
    } catch (error: any) {
      console.error('Lỗi API phân phối:', error);
      alert(`🔌 Lỗi kết nối: Không thể gửi tín hiệu tới server Backend. Chi tiết: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = (id: string, status: 'pending' | 'completed' | 'cancelled') => {
    setLocations(prev => prev.map(loc => loc.id === id ? { ...loc, status } : loc));
  };

  const handleClear = () => {
    setLocations([]);
    setOptimizedRoute([]);
    setRoadGeometry([]);
    setFitnessHistory([]);
    setDistance(null);
    setShowChart(false);
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '24px 40px' }}>
      <Header 
        onOptimize={handleOptimize} 
        onClear={handleClear} 
        loading={loading} 
        hasData={locations.length > 0} 
        showChart={showChart}
        onToggleChart={() => setShowChart(!showChart)}
      />

      {showChart && fitnessHistory.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <FitnessChart history={fitnessHistory} />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 460px', gap: '30px', alignItems: 'start' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', height: '580px', border: '1px solid #e2e8f0' }}>
          <MapView locations={locations} onMapClick={handleMapClick} optimizedRoute={optimizedRoute} roadGeometry={roadGeometry} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <StatsCard totalOrders={locations.length - 1 > 0 ? locations.length - 1 : 0} distance={distance} />
          <OrderSidebar locations={locations} onUpdateStatus={handleUpdateStatus} />
          <TimelineRoute locations={locations} optimizedRoute={optimizedRoute} />
        </div>
      </div>
    </div>
  );
}