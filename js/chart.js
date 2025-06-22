let chart;
const ctx = document.getElementById("grafico").getContext("2d");

function gerarCores(qtd) {
  const coresFixas = ['#4CAF50', '#2196F3', '#FFC107', '#F44336', '#9C27B0', '#00BCD4', '#E91E63'];
  const cores = [];
  for (let i = 0; i < qtd; i++) {
    cores.push(coresFixas[i % coresFixas.length]);
  }
  return cores;
}

function atualizarGrafico(labels, data, tipo = 'bar') {
  if (!chart) {
    chart = new Chart(ctx, {
      type: tipo,
      data: {
        labels: labels,
        datasets: [{
          label: 'Total no Período (R$)',
          data: data,
          backgroundColor: gerarCores(data.length)
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Gráfico de Vendas'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `R$ ${context.parsed.y.toFixed(2)}`;
              }
            }
          }
        },
        scales: {
          y: { beginAtZero: true },
          x: {
            ticks: {
              maxRotation: 45,
              minRotation: 45
            }
          }
        }
      }
    });
  } else {
    chart.config.type = tipo;  // opcional: mudar tipo em atualização
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.data.datasets[0].backgroundColor = gerarCores(data.length);
    chart.update();
  }
}
