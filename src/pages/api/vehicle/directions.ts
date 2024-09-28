// src/pages/api/directions.ts

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { origin, destination } = req.query;

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${googleMapsApiKey}`;

  const response = await fetch(directionsUrl);
  const data = await response.json();

  if (data.status === 'OK') {
    res.status(200).json(data);
  } else {
    res.status(400).json({ error: 'Failed to fetch directions' });
  }
}
