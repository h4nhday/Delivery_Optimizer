export interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export interface GAResult {
  routeIndices: number[];
  distance: number;
  fitnessHistory: number[];
}

// Tính tổng khoảng cách di chuyển qua ma trận đường bộ công cộng
function totalDistance(route: number[], distanceMatrix: number[][]): number {
  let total = 0;
  for (let i = 0; i < route.length - 1; i++) {
    total += distanceMatrix[route[i]][route[i + 1]];
  }
  if (route.length > 0) {
    total += distanceMatrix[route[route.length - 1]][route[0]]; // Vòng quay về tổng kho
  }
  return total;
}

// Tạo lộ trình ngẫu nhiên: LUÔN KHÓA CỐ ĐỊNH KHO (Index 0) ở đầu chuỗi
function shuffleDeliveryRoutes(numLocations: number): number[] {
  const deliveryIndices = Array.from({ length: numLocations - 1 }, (_, i) => i + 1);
  const shuffled = [...deliveryIndices].sort(() => Math.random() - 0.5);
  return [0, ...shuffled]; 
}

// Thuật toán Lai ghép thứ tự chuẩn (Ordered Crossover - OX) khóa cứng Tổng kho
function crossover(parent1: number[], parent2: number[]): number[] {
  const size = parent1.length;
  
  // Tạo mảng con rỗng chứa giá trị đánh dấu tạm thời -1
  const child: number[] = Array(size).fill(-1);
  child[0] = 0; // Cố định Tổng kho ở đầu lộ trình

  // Chọn ngẫu nhiên phân đoạn đơn hàng giao của phụ huynh 1
  const start = Math.floor(Math.random() * (size - 1)) + 1;
  const end = Math.floor(Math.random() * (size - start)) + start;

  // Sao chép phân đoạn của parent1 sang cho con
  for (let i = start; i <= end; i++) {
    child[i] = parent1[i];
  }

  // Điền đầy các vị trí còn lại từ parent2 mà không làm trùng lặp đơn hàng
  let childIdx = 1;
  for (let i = 1; i < size; i++) {
    const p2Element = parent2[i];
    
    // Nếu đơn hàng này của parent2 đã nằm trong phân đoạn lấy từ parent1 thì bỏ qua
    if (child.includes(p2Element)) continue;

    // Tìm vị trí trống tiếp theo (mang giá trị -1) trong mảng con
    while (childIdx < size && child[childIdx] !== -1) {
      childIdx++;
    }
    
    if (childIdx < size) {
      child[childIdx] = p2Element;
    }
  }
  return child;
}

// Đột biến hoán đổi ngẫu nhiên vị trí các đơn hàng (Không đụng vào Tổng kho index 0)
function mutate(route: number[], mutationRate: number): number[] {
  const mutated = [...route];
  if (Math.random() < mutationRate && route.length > 3) {
    const idx1 = Math.floor(Math.random() * (route.length - 1)) + 1;
    let idx2 = Math.floor(Math.random() * (route.length - 1)) + 1;
    
    while (idx1 === idx2) {
      idx2 = Math.floor(Math.random() * (route.length - 1)) + 1;
    }
    
    const temp = mutated[idx1];
    mutated[idx1] = mutated[idx2];
    mutated[idx2] = temp;
  }
  return mutated;
}

export function geneticAlgorithm(numLocations: number, distanceMatrix: number[][]): GAResult {
  const baseRoute = Array.from({ length: numLocations }, (_, i) => i);
  if (numLocations <= 2) {
    return { 
      routeIndices: baseRoute, 
      distance: totalDistance(baseRoute, distanceMatrix), 
      fitnessHistory: [totalDistance(baseRoute, distanceMatrix)] 
    };
  }

  const POP_SIZE = 60;
  const GENERATIONS = 200;
  const MUTATION_RATE = 0.25;
  
  let population: number[][] = Array.from({ length: POP_SIZE }, () => shuffleDeliveryRoutes(numLocations));
  let bestRoute = [...population[0]];
  let bestDistance = totalDistance(bestRoute, distanceMatrix);
  const fitnessHistory: number[] = [];

  for (let g = 0; g < GENERATIONS; g++) {
    population.sort((a, b) => totalDistance(a, distanceMatrix) - totalDistance(b, distanceMatrix));
    
    const currentBestDist = totalDistance(population[0], distanceMatrix);
    if (currentBestDist < bestDistance) {
      bestDistance = currentBestDist;
      bestRoute = [...population[0]];
    }
    fitnessHistory.push(bestDistance);

    // Giữ lại 2 cá thể xuất sắc nhất thế hệ cũ (Tinh hoa giải thuật)
    const nextGeneration: number[][] = [[...population[0]], [...population[1]]];

    while (nextGeneration.length < POP_SIZE) {
      // Chọn lọc giải đấu Tournament chọn cha mẹ tốt nhất
      const tournament = [...population].sort(() => Math.random() - 0.5).slice(0, 5);
      tournament.sort((a, b) => totalDistance(a, distanceMatrix) - totalDistance(b, distanceMatrix));
      
      let child = crossover(tournament[0], tournament[1]);
      child = mutate(child, MUTATION_RATE);
      nextGeneration.push(child);
    }
    population = nextGeneration;
  }

  return { routeIndices: bestRoute, distance: bestDistance, fitnessHistory };
}