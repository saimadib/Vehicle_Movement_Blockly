// src/pages/api/vehicle/index.ts
import { NextApiRequest, NextApiResponse } from 'next';

type VehicleLocation = {
  latitude: number;
  longitude: number;
  timestamp: string;
};

const vehicleData: VehicleLocation[] =[
  { latitude: 17.385044, longitude: 78.486671, timestamp: "2024-07-20T10:00:00Z" },
  { latitude: 17.385100, longitude: 78.486700, timestamp: "2024-07-20T10:00:05Z" },
  { latitude: 17.385150, longitude: 78.486730, timestamp: "2024-07-20T10:00:10Z" },
  { latitude: 17.385200, longitude: 78.486760, timestamp: "2024-07-20T10:00:15Z" },
  { latitude: 17.385250, longitude: 78.486790, timestamp: "2024-07-20T10:00:20Z" },
  { latitude: 17.385300, longitude: 78.486820, timestamp: "2024-07-20T10:00:25Z" },
  { latitude: 17.385350, longitude: 78.486850, timestamp: "2024-07-20T10:00:30Z" },
  { latitude: 17.385400, longitude: 78.486880, timestamp: "2024-07-20T10:00:35Z" },
  { latitude: 17.385450, longitude: 78.486910, timestamp: "2024-07-20T10:00:40Z" },
  { latitude: 17.385500, longitude: 78.486940, timestamp: "2024-07-20T10:00:45Z" },
  { latitude: 17.385550, longitude: 78.486970, timestamp: "2024-07-20T10:00:50Z" },
  { latitude: 17.385600, longitude: 78.487000, timestamp: "2024-07-20T10:00:55Z" },
  { latitude: 17.385650, longitude: 78.487030, timestamp: "2024-07-20T10:01:00Z" },
  { latitude: 17.385700, longitude: 78.487060, timestamp: "2024-07-20T10:01:05Z" },
  { latitude: 17.385750, longitude: 78.487090, timestamp: "2024-07-20T10:01:10Z" },
  { latitude: 17.385800, longitude: 78.487120, timestamp: "2024-07-20T10:01:15Z" },
  { latitude: 17.385850, longitude: 78.487150, timestamp: "2024-07-20T10:01:20Z" },
  { latitude: 17.385900, longitude: 78.487180, timestamp: "2024-07-20T10:01:25Z" },
  { latitude: 17.385950, longitude: 78.487210, timestamp: "2024-07-20T10:01:30Z" },
  { latitude: 17.386000, longitude: 78.487240, timestamp: "2024-07-20T10:01:35Z" },
];


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<VehicleLocation[]>
) {
  res.status(200).json(vehicleData);
}
