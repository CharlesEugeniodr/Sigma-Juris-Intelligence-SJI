/**
 * SJIF Charts - Data Visualization Engine
 * Sigma Juris Intelligence Framework
 *
 * Provides Chart.js wrapper with dark theme styling, brand colors,
 * and specialized chart types for legal document analysis.
 *
 * Requires Chart.js loaded via CDN:
 * <script src="https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js"></script>
 *
 * Attaches to window.SJIFCharts
 */
(function () {
  'use strict';

  // ─── Color Palette ──────────────────────────────────────────────────
  var COLORS = [
    '#D4AF37', // Gold (primary brand)
    '#3498DB', // Bright blue
    '#27AE60', // Emerald green
    '#E74C3C', // Red
    '#9B59B6', // Purple
    '#F39C12', // Orange
    '#1ABC9C', // Teal
    '#E67E22', // Dark orange
    '#2C5364', // Dark teal
    '#8E44AD'  // Deep purple
  ];

  // Extended palette for larger datasets
  var COLORS_EXTENDED = COLORS.concat([
    '#16A085', // Sea green
    '#C0392B', // Dark red
    '#2980B9', // Medium blue
    '#F1C40F', // Yellow
    '#7F8C8D', // Gray
    '#BDC3C7', // Light gray
    '#34495E', // Dark blue-gray
    '#D35400', // Burnt orange
    '#6C3483', // Royal purple
    '#148F77'  // Dark teal-green
  ]);

  // ─── Dark Theme Defaults ────────────────────────────────────────────
  var DEFAULTS = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 800,
      easing: 'easeInOutQuart'
    },
    plugins: {
      legend: {
        labels: {
          color: '#C5CDD5',
          font: {
            family: "'Montserrat', 'Segoe UI', sans-serif",
            size: 12,
            weight: '500'
          },
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 10
        }
      },
      tooltip: {
        backgroundColor: 'rgba(20, 25, 35, 0.95)',
        titleColor: '#D4AF37',
        bodyColor: '#C5CDD5',
        borderColor: 'rgba(212, 175, 55, 0.3)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        titleFont: {
          family: "'Montserrat', 'Segoe UI', sans-serif",
          size: 13,
          weight: '600'
        },
        bodyFont: {
          family: "'Montserrat', 'Segoe UI', sans-serif",
          size: 12
        },
        displayColors: true,
        boxPadding: 4
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#6B7A8D',
          font: {
            family: "'Montserrat', 'Segoe UI', sans-serif",
            size: 11
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false
        },
        border: {
          display: false
        }
      },
      y: {
        ticks: {
          color: '#6B7A8D',
          font: {
            family: "'Montserrat', 'Segoe UI', sans-serif",
            size: 11
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false
        },
        border: {
          display: false
        }
      }
    }
  };

  // ─── Utility Functions ──────────────────────────────────────────────

  /**
   * Deep merge two objects.
   */
  function deepMerge(target, source) {
    var result = {};
    var keys = Object.keys(target);
    for (var i = 0; i < keys.length; i++) {
      result[keys[i]] = target[keys[i]];
    }
    if (source) {
      var srcKeys = Object.keys(source);
      for (var j = 0; j < srcKeys.length; j++) {
        var key = srcKeys[j];
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key]) &&
            result[key] && typeof result[key] === 'object' && !Array.isArray(result[key])) {
          result[key] = deepMerge(result[key], source[key]);
        } else {
          result[key] = source[key];
        }
      }
    }
    return result;
  }

  /**
   * Get color with alpha channel.
   */
  function colorWithAlpha(hexColor, alpha) {
    var r = parseInt(hexColor.slice(1, 3), 16);
    var g = parseInt(hexColor.slice(3, 5), 16);
    var b = parseInt(hexColor.slice(5, 7), 16);
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
  }

  /**
   * Create a gradient for a canvas context.
   */
  function createVerticalGradient(ctx, color, height) {
    var gradient = ctx.createLinearGradient(0, 0, 0, height || 400);
    gradient.addColorStop(0, colorWithAlpha(color, 0.8));
    gradient.addColorStop(1, colorWithAlpha(color, 0.1));
    return gradient;
  }

  // ─── SJIFCharts Class ───────────────────────────────────────────────

  function SJIFCharts() {
    this.charts = {};
  }

  // Expose statics
  SJIFCharts.COLORS = COLORS;
  SJIFCharts.COLORS_EXTENDED = COLORS_EXTENDED;
  SJIFCharts.DEFAULTS = DEFAULTS;

  // ─── Dashboard Charts ───────────────────────────────────────────────

  /**
   * Create a doughnut chart showing document distribution by type.
   *
   * @param {string} canvasId - Canvas element ID.
   * @param {Object} data - { labels: string[], values: number[] }
   * @returns {Object} Chart instance.
   */
  SJIFCharts.prototype.createDocumentsByTypeChart = function (canvasId, data) {
    this.destroyChart(canvasId);

    var ctx = document.getElementById(canvasId);
    if (!ctx) {
      console.warn('SJIFCharts: Canvas element "' + canvasId + '" not found.');
      return null;
    }

    var colors = data.labels.map(function (_, i) {
      return COLORS_EXTENDED[i % COLORS_EXTENDED.length];
    });

    var chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.labels,
        datasets: [{
          data: data.values,
          backgroundColor: colors,
          borderColor: colors.map(function (c) { return colorWithAlpha(c, 0.8); }),
          borderWidth: 2,
          hoverBorderWidth: 3,
          hoverBorderColor: '#FFFFFF',
          spacing: 2
        }]
      },
      options: deepMerge(DEFAULTS, {
        cutout: '65%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#C5CDD5',
              font: {
                family: "'Montserrat', 'Segoe UI', sans-serif",
                size: 11
              },
              padding: 12,
              usePointStyle: true,
              pointStyleWidth: 8,
              generateLabels: function (chart) {
                var dataset = chart.data.datasets[0];
                var total = dataset.data.reduce(function (sum, val) { return sum + val; }, 0);
                return chart.data.labels.map(function (label, i) {
                  var value = dataset.data[i];
                  var pct = total > 0 ? Math.round((value / total) * 100) : 0;
                  return {
                    text: label + ' (' + pct + '%)',
                    fillStyle: colors[i],
                    strokeStyle: colors[i],
                    lineWidth: 0,
                    hidden: false,
                    index: i,
                    pointStyle: 'circle'
                  };
                });
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                var total = context.dataset.data.reduce(function (sum, val) { return sum + val; }, 0);
                var value = context.parsed;
                var pct = total > 0 ? Math.round((value / total) * 100) : 0;
                return context.label + ': ' + value + ' (' + pct + '%)';
              }
            }
          }
        },
        scales: {} // No scales for doughnut
      })
    });

    this.charts[canvasId] = chart;
    return chart;
  };

  /**
   * Create a horizontal bar chart showing documents by category.
   *
   * @param {string} canvasId
   * @param {Object} data - { labels: string[], values: number[] }
   * @returns {Object} Chart instance.
   */
  SJIFCharts.prototype.createDocumentsByCategoryChart = function (canvasId, data) {
    this.destroyChart(canvasId);

    var ctx = document.getElementById(canvasId);
    if (!ctx) {
      console.warn('SJIFCharts: Canvas element "' + canvasId + '" not found.');
      return null;
    }

    var colors = data.labels.map(function (_, i) {
      return COLORS_EXTENDED[i % COLORS_EXTENDED.length];
    });

    var chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Documentos',
          data: data.values,
          backgroundColor: colors.map(function (c) { return colorWithAlpha(c, 0.7); }),
          borderColor: colors,
          borderWidth: 1,
          borderRadius: 6,
          barPercentage: 0.7,
          categoryPercentage: 0.8
        }]
      },
      options: deepMerge(DEFAULTS, {
        indexAxis: 'y',
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              color: '#6B7A8D',
              stepSize: 1,
              font: { family: "'Montserrat', 'Segoe UI', sans-serif", size: 11 }
            },
            grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
            border: { display: false }
          },
          y: {
            ticks: {
              color: '#C5CDD5',
              font: { family: "'Montserrat', 'Segoe UI', sans-serif", size: 12 }
            },
            grid: { display: false },
            border: { display: false }
          }
        }
      })
    });

    this.charts[canvasId] = chart;
    return chart;
  };

  /**
   * Create a bar chart showing score distribution ranges.
   *
   * @param {string} canvasId
   * @param {Object} data - { labels: string[], values: number[], colors?: string[] }
   * @returns {Object} Chart instance.
   */
  SJIFCharts.prototype.createScoreDistributionChart = function (canvasId, data) {
    this.destroyChart(canvasId);

    var ctx = document.getElementById(canvasId);
    if (!ctx) {
      console.warn('SJIFCharts: Canvas element "' + canvasId + '" not found.');
      return null;
    }

    // Score range colors: Crítico → Excelente
    var scoreColors = data.colors || ['#E74C3C', '#E67E22', '#F39C12', '#27AE60', '#D4AF37'];
    var bgColors = data.labels.map(function (_, i) {
      return colorWithAlpha(scoreColors[i % scoreColors.length], 0.7);
    });
    var borderColors = data.labels.map(function (_, i) {
      return scoreColors[i % scoreColors.length];
    });

    var chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Documentos',
          data: data.values,
          backgroundColor: bgColors,
          borderColor: borderColors,
          borderWidth: 2,
          borderRadius: 8,
          barPercentage: 0.6
        }]
      },
      options: deepMerge(DEFAULTS, {
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            ticks: {
              color: '#C5CDD5',
              font: { family: "'Montserrat', 'Segoe UI', sans-serif", size: 11, weight: '500' }
            },
            grid: { display: false },
            border: { display: false }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: '#6B7A8D',
              stepSize: 1,
              font: { family: "'Montserrat', 'Segoe UI', sans-serif", size: 11 }
            },
            grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
            border: { display: false }
          }
        }
      })
    });

    this.charts[canvasId] = chart;
    return chart;
  };

  /**
   * Create a line chart showing documents analyzed over time.
   *
   * @param {string} canvasId
   * @param {Object} data - { labels: string[], values: number[] }
   * @returns {Object} Chart instance.
   */
  SJIFCharts.prototype.createTimelineChart = function (canvasId, data) {
    this.destroyChart(canvasId);

    var ctx = document.getElementById(canvasId);
    if (!ctx) {
      console.warn('SJIFCharts: Canvas element "' + canvasId + '" not found.');
      return null;
    }

    var canvasCtx = ctx.getContext('2d');
    var gradient = createVerticalGradient(canvasCtx, '#D4AF37', ctx.parentElement ? ctx.parentElement.clientHeight : 300);

    var chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Documentos Analisados',
          data: data.values,
          borderColor: '#D4AF37',
          backgroundColor: gradient,
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#D4AF37',
          pointBorderColor: '#141923',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: '#FFFFFF',
          pointHoverBorderColor: '#D4AF37',
          pointHoverBorderWidth: 3
        }]
      },
      options: deepMerge(DEFAULTS, {
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            ticks: {
              color: '#6B7A8D',
              maxRotation: 45,
              font: { family: "'Montserrat', 'Segoe UI', sans-serif", size: 10 }
            },
            grid: { color: 'rgba(255, 255, 255, 0.03)', drawBorder: false },
            border: { display: false }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: '#6B7A8D',
              stepSize: 1,
              font: { family: "'Montserrat', 'Segoe UI', sans-serif", size: 11 }
            },
            grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
            border: { display: false }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      })
    });

    this.charts[canvasId] = chart;
    return chart;
  };

  /**
   * Create a grouped bar chart for monthly comparisons.
   *
   * @param {string} canvasId
   * @param {Object} data - { labels: string[], datasets: Array<{ label: string, values: number[] }> }
   * @returns {Object} Chart instance.
   */
  SJIFCharts.prototype.createMonthlyComparisonChart = function (canvasId, data) {
    this.destroyChart(canvasId);

    var ctx = document.getElementById(canvasId);
    if (!ctx) {
      console.warn('SJIFCharts: Canvas element "' + canvasId + '" not found.');
      return null;
    }

    var datasets = data.datasets.map(function (ds, idx) {
      var color = COLORS[idx % COLORS.length];
      return {
        label: ds.label,
        data: ds.values,
        backgroundColor: colorWithAlpha(color, 0.7),
        borderColor: color,
        borderWidth: 2,
        borderRadius: 6,
        barPercentage: 0.7,
        categoryPercentage: 0.8
      };
    });

    var chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: datasets
      },
      options: deepMerge(DEFAULTS, {
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#C5CDD5',
              font: { family: "'Montserrat', 'Segoe UI', sans-serif", size: 11 },
              padding: 16,
              usePointStyle: true,
              pointStyleWidth: 10
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: '#C5CDD5',
              font: { family: "'Montserrat', 'Segoe UI', sans-serif", size: 11 }
            },
            grid: { display: false },
            border: { display: false }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: '#6B7A8D',
              font: { family: "'Montserrat', 'Segoe UI', sans-serif", size: 11 }
            },
            grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
            border: { display: false }
          }
        }
      })
    });

    this.charts[canvasId] = chart;
    return chart;
  };

  // ─── Analysis Charts ────────────────────────────────────────────────

  /**
   * Create a 6-axis radar chart for MCJ coherence criteria.
   *
   * @param {string} canvasId
   * @param {Object} coerenciaData - MCJ criteria scores object.
   * @returns {Object} Chart instance.
   */
  SJIFCharts.prototype.createRadarChart = function (canvasId, coerenciaData) {
    this.destroyChart(canvasId);

    var ctx = document.getElementById(canvasId);
    if (!ctx) {
      console.warn('SJIFCharts: Canvas element "' + canvasId + '" not found.');
      return null;
    }

    var labelMap = {
      consistenciaLogica: 'Consistência Lógica',
      adequacaoNormativa: 'Adequação Normativa',
      suficienciaProbatoria: 'Suficiência Probatória',
      coerenciaArgumentativa: 'Coerência Argumentativa',
      pertinenciaJurisprudencial: 'Pertinência Jurisprudencial',
      clarezaRedacional: 'Clareza Redacional'
    };

    var keys = Object.keys(labelMap);
    var labels = keys.map(function (k) { return labelMap[k]; });
    var values = keys.map(function (k) { return coerenciaData[k] || 0; });

    var chart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [{
          label: 'MCJ - Coerência Jurídica',
          data: values,
          backgroundColor: 'rgba(212, 175, 55, 0.20)',
          borderColor: '#D4AF37',
          borderWidth: 3,
          pointBackgroundColor: '#D4AF37',
          pointBorderColor: '#141923',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 9,
          pointHoverBackgroundColor: '#FFFFFF',
          pointHoverBorderColor: '#D4AF37',
          pointHoverBorderWidth: 3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1000,
          easing: 'easeInOutQuart'
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: '#D4AF37',
              font: {
                family: "'Montserrat', 'Segoe UI', sans-serif",
                size: 13,
                weight: '600'
              },
              padding: 20,
              usePointStyle: true,
              pointStyleWidth: 10
            }
          },
          tooltip: {
            backgroundColor: 'rgba(20, 25, 35, 0.95)',
            titleColor: '#D4AF37',
            bodyColor: '#C5CDD5',
            borderColor: 'rgba(212, 175, 55, 0.3)',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
            callbacks: {
              label: function (context) {
                return context.label + ': ' + context.parsed.r + '/100';
              }
            }
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            min: 0,
            ticks: {
              stepSize: 20,
              color: '#6B7A8D',
              backdropColor: 'transparent',
              font: {
                family: "'Montserrat', 'Segoe UI', sans-serif",
                size: 10
              }
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.08)',
              circular: true
            },
            angleLines: {
              color: 'rgba(255, 255, 255, 0.08)'
            },
            pointLabels: {
              color: '#C5CDD5',
              font: {
                family: "'Montserrat', 'Segoe UI', sans-serif",
                size: 11,
                weight: '500'
              },
              padding: 12
            }
          }
        }
      }
    });

    this.charts[canvasId] = chart;
    return chart;
  };

  /**
   * Create a horizontal bar chart for the 9 elements scores.
   *
   * @param {string} canvasId
   * @param {Object} elementsData - The elements object from analysis results.
   * @returns {Object} Chart instance.
   */
  SJIFCharts.prototype.createElementsChart = function (canvasId, elementsData) {
    this.destroyChart(canvasId);

    var ctx = document.getElementById(canvasId);
    if (!ctx) {
      console.warn('SJIFCharts: Canvas element "' + canvasId + '" not found.');
      return null;
    }

    var elementLabels = {
      fatos: 'Fatos',
      provas: 'Provas',
      hipoteses: 'Hipóteses',
      inferencias: 'Inferências',
      normas: 'Normas',
      jurisprudencia: 'Jurisprudência',
      doutrina: 'Doutrina',
      conclusao: 'Conclusão',
      recomendacao: 'Recomendação'
    };

    var keys = Object.keys(elementLabels);
    var labels = keys.map(function (k) { return elementLabels[k]; });
    var values = keys.map(function (k) {
      return elementsData[k] ? elementsData[k].score : 0;
    });

    // Color-code by score level
    var bgColors = values.map(function (v) {
      if (v >= 85) return colorWithAlpha('#D4AF37', 0.8); // Gold - Excelente
      if (v >= 70) return colorWithAlpha('#27AE60', 0.8); // Green - Bom
      if (v >= 50) return colorWithAlpha('#3498DB', 0.8); // Blue - Satisfatório
      if (v >= 30) return colorWithAlpha('#F39C12', 0.8); // Orange - Insuficiente
      return colorWithAlpha('#E74C3C', 0.8);              // Red - Crítico
    });

    var borderColors = values.map(function (v) {
      if (v >= 85) return '#D4AF37';
      if (v >= 70) return '#27AE60';
      if (v >= 50) return '#3498DB';
      if (v >= 30) return '#F39C12';
      return '#E74C3C';
    });

    var chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Score dos Elementos',
          data: values,
          backgroundColor: bgColors,
          borderColor: borderColors,
          borderWidth: 2,
          borderRadius: 6,
          barPercentage: 0.65,
          categoryPercentage: 0.85
        }]
      },
      options: deepMerge(DEFAULTS, {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (context) {
                var score = context.parsed.x;
                var label;
                if (score >= 85) label = 'Excelente';
                else if (score >= 70) label = 'Bom';
                else if (score >= 50) label = 'Satisfatório';
                else if (score >= 30) label = 'Insuficiente';
                else label = 'Crítico';
                return 'Score: ' + score + '/100 (' + label + ')';
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 100,
            ticks: {
              color: '#6B7A8D',
              stepSize: 20,
              callback: function (value) { return value + '%'; },
              font: { family: "'Montserrat', 'Segoe UI', sans-serif", size: 10 }
            },
            grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
            border: { display: false }
          },
          y: {
            ticks: {
              color: '#C5CDD5',
              font: { family: "'Montserrat', 'Segoe UI', sans-serif", size: 12, weight: '500' }
            },
            grid: { display: false },
            border: { display: false }
          }
        }
      })
    });

    this.charts[canvasId] = chart;
    return chart;
  };

  // ─── Utility Methods ────────────────────────────────────────────────

  /**
   * Destroy a specific chart instance.
   * @param {string} chartId - Canvas ID used as chart key.
   */
  SJIFCharts.prototype.destroyChart = function (chartId) {
    if (this.charts[chartId]) {
      this.charts[chartId].destroy();
      delete this.charts[chartId];
    }
  };

  /**
   * Destroy all chart instances.
   */
  SJIFCharts.prototype.destroyAll = function () {
    var chartIds = Object.keys(this.charts);
    for (var i = 0; i < chartIds.length; i++) {
      this.charts[chartIds[i]].destroy();
    }
    this.charts = {};
  };

  /**
   * Update an existing chart with new data.
   *
   * @param {string} chartId - Canvas ID used as chart key.
   * @param {Object} newData - { labels?: string[], datasets?: Array }
   */
  SJIFCharts.prototype.updateChart = function (chartId, newData) {
    var chart = this.charts[chartId];
    if (!chart) {
      console.warn('SJIFCharts: Chart "' + chartId + '" not found for update.');
      return;
    }

    if (newData.labels) {
      chart.data.labels = newData.labels;
    }

    if (newData.datasets) {
      for (var i = 0; i < newData.datasets.length; i++) {
        if (chart.data.datasets[i]) {
          var dsKeys = Object.keys(newData.datasets[i]);
          for (var j = 0; j < dsKeys.length; j++) {
            chart.data.datasets[i][dsKeys[j]] = newData.datasets[i][dsKeys[j]];
          }
        }
      }
    }

    // If simple values array passed
    if (newData.values && chart.data.datasets[0]) {
      chart.data.datasets[0].data = newData.values;
    }

    chart.update('active');
  };

  // Attach to window
  window.SJIFCharts = SJIFCharts;

})();
