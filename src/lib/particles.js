export const particles = {
  "tiers": [
    {
      "id": "small",
      "count": 250,
      "size": 2,
      "color": "var(--surface)",
      "alphaMax": 0.3,
      "fill": false,
      "composite": "lighter"
    },
    {
      "id": "medium",
      "count": 50,
      "size": 4,
      "color": "var(--surface)",
      "alphaMax": 0.25,
      "fill": true,
      "composite": "screen"
    },
    {
      "id": "large",
      "count": 15,
      "size": 8,
      "color": "var(--surface)",
      "alphaMax": 0.1,
      "fill": true,
      "composite": "overlay"
    }
  ],
  "globalOpacity": 0.4,
  "speedRange": [1, 5],
  "driftDistance": "2× size"
};
