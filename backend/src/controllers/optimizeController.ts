import { Request, Response } from 'express';
import { geneticAlgorithm, Location } from '../algorithms/geneticAlgorithm';

// Hàm tính toán đường chim bay dự phòng khi API OSRM bị sập/nghẽn mạng
function getHaversineDistance(loc1: Location, loc2: Location): number {
  const R = 6371000; // Bán kính Trái Đất (mét)
  const dLat = ((loc2.lat - loc1.lat) * Math.PI) / 180;
  const dLng = ((loc2.lng - loc1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((loc1.lat * Math.PI) / 180) *
      Math.cos((loc2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
}

export const handleOptimization = async (req: Request, res: Response) => {
  try {
    const locations: Location[] = req.body;
    if (!locations || locations.length < 3) {
      return res.status(400).json({ success: false, error: 'Cần tối thiểu 1 kho và 2 điểm giao hàng.' });
    }

    const coordString = locations.map(loc => `${loc.lng},${loc.lat}`).join(';');
    // ĐỔI THÀNH HTTPS để tránh bị chặn bảo mật mạng
    const tableUrl = `https://router.project-osrm.org/table/v1/bicycle/${coordString}?annotations=distance`;
    
    let distanceMatrix: number[][];
    let isFallback = false;

    try {
      const tableResponse = await fetch(tableUrl);
      const tableData = await tableResponse.json();
      
      if (tableData && tableData.distances) {
        distanceMatrix = tableData.distances;
      } else {
        throw new Error('OSRM không trả về ma trận khoảng cách');
      }
    } catch (e) {
      console.warn('⚠️ OSRM Server quá tải hoặc lỗi mạng. Tự động kích hoạt cơ chế dự phòng Haversine!');
      isFallback = true;
      // Khởi tạo ma trận khoảng cách hình học dự phòng
      distanceMatrix = Array.from({ length: locations.length }, () => Array(locations.length).fill(0));
      for (let i = 0; i < locations.length; i++) {
        for (let j = 0; j < locations.length; j++) {
          distanceMatrix[i][j] = getHaversineDistance(locations[i], locations[j]);
        }
      }
    }

    // Chạy giải thuật di truyền
    const gaResult = geneticAlgorithm(locations.length, distanceMatrix);
    const optimizedRoute = gaResult.routeIndices.map(index => locations[index]);

    let roadGeometry: [number, number][] = [];
    let realDistanceKm = 0;

    // Nếu không phải chế độ dự phòng, cố gắng lấy đường đi thực tế ôm sát mặt đường
    if (!isFallback) {
      try {
        const finalRouteCoords = optimizedRoute.map(loc => `${loc.lng},${loc.lat}`);
        finalRouteCoords.push(`${optimizedRoute[0].lng},${optimizedRoute[0].lat}`); 
        
        const routeUrl = `https://router.project-osrm.org/route/v1/bicycle/${finalRouteCoords.join(';')}?overview=full&geometries=geojson`;
        const routeResponse = await fetch(routeUrl);
        const routeData = await routeResponse.json();

        if (routeData.routes && routeData.routes.length > 0) {
          roadGeometry = routeData.routes[0].geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]);
          realDistanceKm = routeData.routes[0].distance / 1000; 
        } else {
          realDistanceKm = gaResult.distance / 1000;
        }
      } catch (err) {
        realDistanceKm = gaResult.distance / 1000;
      }
    } else {
      // Ở chế độ dự phòng hình học, vẽ đường thẳng nối các điểm ghim và tính khoảng cách
      realDistanceKm = gaResult.distance / 1000;
      roadGeometry = optimizedRoute.map(loc => [loc.lat, loc.lng]);
      roadGeometry.push([optimizedRoute[0].lat, optimizedRoute[0].lng]); // Quay về kho
    }

    return res.json({
      success: true,
      route: optimizedRoute,
      distance: realDistanceKm,
      fitnessHistory: gaResult.fitnessHistory.map(d => d / 1000),
      roadGeometry: roadGeometry,
      isFallback: isFallback
    });

  } catch (error) {
    console.error('Lỗi phân tích hệ thống:', error);
    return res.status(500).json({ success: false, error: 'Hệ thống định vị máy chủ gặp trục trặc.' });
  }
};