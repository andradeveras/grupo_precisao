// =====================
// SIMULADOR DE TAXAS
// =====================
const valorInput = document.getElementById("valor");
const percentualInput = document.getElementById("percentual");
const mesesInput = document.getElementById("meses");

const valorMensalSpan = document.getElementById("valorMensal");
const valorTotalSpan = document.getElementById("valorTotal");
const tabela = document.getElementById("tabelaComparativa");
const ctx = document.getElementById("grafico") ? document.getElementById("grafico").getContext("2d") : null;

let chart;

// Formata o valor como moeda brasileira
function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

// Calcula o valor mensal e total com base nos inputs
function calcular() {
  const valor = parseFloat(valorInput.value);
  const percentual = parseFloat(percentualInput.value);
  const meses = parseInt(mesesInput.value);

  if (!valor || !percentual || !meses) return;

  const mensal = valor * (percentual / 100);
  const total = mensal * meses;

  valorMensalSpan.textContent = formatCurrency(mensal);
  valorTotalSpan.textContent = formatCurrency(total);

  // Comparativo
  const taxas = [5, 10, 15];
  const comparativo = taxas.map(p => {
    const m = valor * (p / 100);
    return {
      percentual: p + "%",
      mensal: formatCurrency(m),
      total: formatCurrency(m * meses),
      valorTotal: m * meses
    };
  });

  // Insere o percentual do usuário no meio do comparativo
  comparativo.splice(1, 0, {
    percentual: percentual + "% (Cliente)",
    mensal: formatCurrency(mensal),
    total: formatCurrency(total),
    valorTotal: total
  });

  tabela.innerHTML = "";
  comparativo.forEach(c => {
    const row = `<tr><td>${c.percentual}</td><td>${c.mensal}</td><td>${c.total}</td></tr>`;
    tabela.innerHTML += row;
  });

  // Gráfico de barras do comparativo
  if (ctx) {
    const labels = comparativo.map(c => c.percentual);
    const data = comparativo.map(c => c.valorTotal);

    if (chart) chart.destroy();
    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total no Período (R$)',
          data: data,
          backgroundColor: '#0B66C3'
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}

if (valorInput && percentualInput && mesesInput) {
  valorInput.addEventListener("input", calcular);
  percentualInput.addEventListener("input", calcular);
  mesesInput.addEventListener("input", calcular);
}

// =====================
// DOMContentLoaded
// =====================
document.addEventListener("DOMContentLoaded", function() {
  // MENU MOBILE
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('menu-mobile');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('open');
    });
    document.querySelectorAll('#menu-mobile a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
      });
    });
  }

  // MODO NOTURNO
  const btnDarkmode = document.getElementById('btn-darkmode');
  if (btnDarkmode) {
    btnDarkmode.addEventListener('click', () => {
      document.body.classList.toggle('darkmode');
      if(document.body.classList.contains('darkmode')) {
        localStorage.setItem('modo', 'dark');
      } else {
        localStorage.setItem('modo', 'light');
      }
    });
    // Aplica preferência ao carregar
    if(localStorage.getItem('modo') === 'dark') {
      document.body.classList.add('darkmode');
    }
  }

  // FORMULÁRIO DE CONTATO
  const form = document.getElementById('form-contato');
  if (form) {
    function setError(input, message) {
      let error = input.parentNode.querySelector('.error-message');
      if (error) error.remove();

      if (message) {
        error = document.createElement('span');
        error.className = 'error-message';
        error.style.color = 'red';
        error.style.fontSize = '0.85rem';
        error.style.marginTop = '0.25rem';
        error.textContent = message;
        input.parentNode.appendChild(error);
      }
    }

    function validarEmail(email) {
      const re = /\S+@\S+\.\S+/;
      return re.test(email);
    }

    form.addEventListener('submit', function(event) {
      event.preventDefault();

      let valid = true;

      const nome = form.nome;
      const email = form.email;
      const telefone = form.telefone;
      const tipoServico = form.tipo_servico;

      if (nome.value.trim() === '') {
        setError(nome, 'Por favor, preencha seu nome.');
        valid = false;
      } else {
        setError(nome, null);
      }

      if (email.value.trim() === '') {
        setError(email, 'Por favor, preencha seu e-mail.');
        valid = false;
      } else if (!validarEmail(email.value.trim())) {
        setError(email, 'Digite um e-mail válido.');
        valid = false;
      } else {
        setError(email, null);
      }

      if (telefone.value.trim() === '') {
        setError(telefone, 'Por favor, preencha seu telefone.');
        valid = false;
      } else {
        setError(telefone, null);
      }

      if (tipoServico.value === '') {
        setError(tipoServico, 'Selecione uma opção.');
        valid = false;
      } else {
        setError(tipoServico, null);
      }

      if (!valid) return;

      // Monta os dados para enviar via fetch
      const formData = new FormData(form);

      fetch(form.action, {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
      }).then(() => {
        window.location.href = "obrigado.html"; 
        form.reset();
      }).catch(() => {
        alert('Erro ao enviar formulário. Tente novamente.');
      });
    });
  }
});

// =====================
// BOTÃO VOLTAR AO TOPO
// =====================
const btnTopo = document.getElementById('btn-topo');
if (btnTopo) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btnTopo.classList.add('show');
    } else {
      btnTopo.classList.remove('show');
    }
  });

  btnTopo.addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// =====================
// GERAR PDF DO SIMULADOR
// =====================

const btnPDF = document.getElementById('btn-gerar-pdf');
if (btnPDF) {
  btnPDF.addEventListener('click', function () {
    const valor = document.getElementById("valor").value;
    const percentual = document.getElementById("percentual").value;
    const meses = document.getElementById("meses").value;
    const valorMensal = document.getElementById("valorMensal").textContent;
    const valorTotal = document.getElementById("valorTotal").textContent;

    // Pega a tabela comparativa
    const tabela = document.getElementById("tabelaComparativa");
    let comparativo = [];
    if (tabela) {
      for (let row of tabela.querySelectorAll('tr')) {
        const cols = row.querySelectorAll('td');
        if (cols.length === 3) {
          comparativo.push([
            cols[0].textContent.trim(),
            cols[1].textContent.trim(),
            cols[2].textContent.trim()
          ]);
        }
      }
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Simulação de Taxa de Administração", 20, 20);

    doc.setFontSize(12);
    doc.text(`Valor mensal do condomínio: R$ ${valor}`, 20, 35);
    doc.text(`Percentual da taxa: ${percentual}%`, 20, 43);
    doc.text(`Número de meses: ${meses}`, 20, 51);

    doc.setFontSize(14);
    doc.text("Resultado:", 20, 65);
    doc.setFontSize(12);
    doc.text(`Valor mensal da taxa: ${valorMensal}`, 20, 73);
    doc.text(`Total no período: ${valorTotal}`, 20, 81);

    // Tabela comparativa
    if (comparativo.length > 0) {
      doc.setFontSize(13);
      doc.text("Comparativo de Taxas:", 20, 95);
      doc.setFontSize(11);
      let y = 103;
      doc.text("Percentual", 20, y);
      doc.text("Mensal", 60, y);
      doc.text("Total", 110, y);
      y += 7;
      comparativo.forEach(linha => {
        doc.text(linha[0], 20, y);
        doc.text(linha[1], 60, y);
        doc.text(linha[2], 110, y);
        y += 7;
      });
      // Adiciona o gráfico logo após a tabela
      const graficoCanvas = document.getElementById('grafico');
      if (graficoCanvas) {
        const imgData = graficoCanvas.toDataURL('image/png', 1.0);
        // Ajuste a posição Y conforme necessário para não sobrepor a tabela
        doc.addImage(imgData, 'PNG', 20, y + 10, 170, 60);
      }
    }

    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text("Gerado por Grupo Precisão", 20, 280);

    doc.save("simulacao_taxa.pdf");
  });
}