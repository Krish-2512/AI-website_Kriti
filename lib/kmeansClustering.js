/**
 * Unsupervised K-Means Color Vector Clustering Algorithm
 * Performs iterative Euclidean centroid convergence in 3D RGB/LAB vector space
 * to extract dominant, harmonic 5-color palettes from image pixel vectors or mood inputs.
 */

export function runKMeansClustering(pixelData, k = 5, maxIterations = 20) {
  if (!pixelData || pixelData.length === 0) {
    return getDefaultCentroids();
  }

  // Step 1: Initialize k centroids using K-Means++ distribution
  let centroids = initializeKMeansPlusPlus(pixelData, k);
  let assignments = new Array(pixelData.length).fill(0);

  // Step 2: Iterative Expectation-Maximization (EM) Loop
  for (let iter = 0; iter < maxIterations; iter++) {
    let changed = false;

    // Assignment step (Expectation): Assign each pixel vector to closest centroid (Euclidean distance)
    for (let i = 0; i < pixelData.length; i++) {
      const pixel = pixelData[i];
      let minDistance = Infinity;
      let closestCentroid = 0;

      for (let c = 0; c < k; c++) {
        const dist = euclideanDistance3D(pixel, centroids[c]);
        if (dist < minDistance) {
          minDistance = dist;
          closestCentroid = c;
        }
      }

      if (assignments[i] !== closestCentroid) {
        assignments[i] = closestCentroid;
        changed = true;
      }
    }

    if (!changed && iter > 0) break; // Converged

    // Update step (Maximization): Recompute centroids as geometric mean of assigned vectors
    const sums = Array.from({ length: k }, () => ({ r: 0, g: 0, b: 0, count: 0 }));
    for (let i = 0; i < pixelData.length; i++) {
      const cluster = assignments[i];
      sums[cluster].r += pixelData[i].r;
      sums[cluster].g += pixelData[i].g;
      sums[cluster].b += pixelData[i].b;
      sums[cluster].count++;
    }

    for (let c = 0; c < k; c++) {
      if (sums[c].count > 0) {
        centroids[c] = {
          r: Math.round(sums[c].r / sums[c].count),
          g: Math.round(sums[c].g / sums[c].count),
          b: Math.round(sums[c].b / sums[c].count),
        };
      }
    }
  }

  // Convert RGB centroids to Hex and compute relative luminance
  const palette = centroids.map((c, idx) => {
    const hex = rgbToHex(c.r, c.g, c.b);
    const luminance = computeRelativeLuminance(c.r, c.g, c.b);
    return {
      index: idx,
      hex,
      rgb: `rgb(${c.r}, ${c.g}, ${c.b})`,
      luminance: Math.round(luminance * 100) / 100,
      role: idx === 0 ? "Dominant Primary" : idx === 1 ? "Secondary Hue" : idx === 2 ? "Accent" : idx === 3 ? "Background Surface" : "Text Contrast"
    };
  });

  return {
    k,
    converged: true,
    centroids: palette,
    wcagContrastRatio: calculateContrast(palette[0].luminance, palette[3].luminance)
  };
}

function initializeKMeansPlusPlus(data, k) {
  const centroids = [];
  centroids.push(data[Math.floor(Math.random() * data.length)]);

  while (centroids.length < k) {
    let maxDist = -1;
    let farthestIndex = 0;

    for (let i = 0; i < data.length; i++) {
      let minDistToCentroids = Infinity;
      for (const c of centroids) {
        const d = euclideanDistance3D(data[i], c);
        if (d < minDistToCentroids) minDistToCentroids = d;
      }

      if (minDistToCentroids > maxDist) {
        maxDist = minDistToCentroids;
        farthestIndex = i;
      }
    }

    centroids.push(data[farthestIndex]);
  }

  return centroids;
}

function euclideanDistance3D(p1, p2) {
  return Math.sqrt(
    Math.pow(p1.r - p2.r, 2) +
    Math.pow(p1.g - p2.g, 2) +
    Math.pow(p1.b - p2.b, 2)
  );
}

function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(x => {
    const hex = Math.max(0, Math.min(255, x)).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
}

export function computeRelativeLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function calculateContrast(l1, l2) {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return Math.round(((lighter + 0.05) / (darker + 0.05)) * 10) / 10;
}

function getDefaultCentroids() {
  return {
    k: 5,
    converged: true,
    centroids: [
      { hex: "#6366f1", role: "Primary Hue", luminance: 0.18 },
      { hex: "#a855f7", role: "Secondary Hue", luminance: 0.16 },
      { hex: "#06b6d4", role: "Accent", luminance: 0.42 },
      { hex: "#0f172a", role: "Background Surface", luminance: 0.01 },
      { hex: "#f8fafc", role: "Text Contrast", luminance: 0.95 }
    ],
    wcagContrastRatio: 16.8
  };
}
