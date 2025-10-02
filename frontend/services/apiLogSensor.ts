const API_BASE_URL = 'https://thegt.my.id/api';
const API_ENDPOINT = `${API_BASE_URL}/sensor-data`;

const getHeaders = (): Record<string, string> => ({
  'Content-Type': 'application/json',
});

export interface SensorData {
  id: number;
  user_id: number;
  left_weight: string;
  right_weight: string;
  left_mpu: string;
  right_mpu: string;
  piezo1: string;
  piezo2: string;
  piezo3: string;
  piezo4: string;
  piezo5: string;
  param1: string;
  param2: string;
  param3: string;
  param4: string;
  param5: string;
  param6: string;
  oa_score: string;
  oa_risk_category: string;
  created_at: string;
  updated_at: string;
}

export interface SensorResponse {
  success: boolean;
  count: number;
  data: SensorData[];
}

export const getSensorData = async (): Promise<SensorData[]> => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
    }

    const jsonResponse: SensorResponse = await response.json();

    if (!jsonResponse.success) {
      throw new Error(`API error: ${jsonResponse.success ? '' : 'Request failed'}`);
    }

    const sortedData = jsonResponse.data.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateB - dateA; 
    });

    return sortedData;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error in getSensorData:', errorMessage);
    throw new Error(`Failed to fetch sensor data: ${errorMessage}`);
  }
};

export const getFullSensorResponse = async (): Promise<SensorResponse> => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
    }

    const jsonResponse: SensorResponse = await response.json();

    if (!jsonResponse.success) {
      throw new Error(`API error: Request failed`);
    }

    return jsonResponse;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error in getFullSensorResponse:', errorMessage);
    throw new Error(`Failed to fetch sensor response: ${errorMessage}`);
  }
};