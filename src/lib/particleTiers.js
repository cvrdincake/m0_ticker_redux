```json
{
  "tiers": [
    {
      "id": "small",
      "count": 250,
      "size": 2,
      "color": "var(--surface)",
      "alphaMax": 0.3,
      "fill": false,
      "speedRange": [1, 3],
      "driftDistance": 4
    },
    {
      "id": "medium",
      "count": 80,
      "size": 6,
      "color": "var(--surface)",
      "alphaMax": 0.25,
      "fill": true,
      "blur": 3,
      "speedRange": [1, 4],
      "driftDistance": 12
    },
    {
      "id": "large",
      "count": 8,
      "size": 20,
      "color": "var(--surface)",
      "alphaMax": 0.15,
      "fill": true,
      "blur": 10,
      "speedRange": [2, 5],
      "driftDistance": 40
    }
  ],
  "globalOpacity": 0.4,
  "canvasComposite": "lighter"
}