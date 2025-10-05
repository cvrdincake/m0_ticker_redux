export const particleTiers = {
  "tiers": [
    {
      "id": "small",
      "count": 250,
      "size": 2,
      "color": "var(--surface)",
      "alphaMax": 0.3,
      "fill": false,
      "stroke": true,
      "strokeWeight": 1,
      "blur": 0.5,
      "blend": "difference"
    },
    {
      "id": "medium", 
      "count": 50,
      "size": 4,
      "color": "var(--surface)",
      "alphaMax": 0.25,
      "fill": true,
      "stroke": false,
      "blur": 1,
      "blend": "screen"
    },
    {
      "id": "large",
      "count": 15,
      "size": 8,
      "color": "var(--surface)",
      "alphaMax": 0.1,
      "fill": true,
      "stroke": false,
      "blur": 2,
      "blend": "overlay"
    }
  ],
  "globalOpacity": 0.4,
  "speedRange": [1, 5],
  "driftDistance": "2× size"
};
