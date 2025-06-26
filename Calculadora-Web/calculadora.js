class CalculadoraBasica extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });

    this.shadow.innerHTML = `
      <link rel="stylesheet" href="bootstrap/bootstrap.min.css">
      <div class="card p-3">
        <div class="mb-2">
          <input type="number" class="form-control" id="num1" placeholder="Número 1">
        </div>
        <div class="mb-2">
          <input type="number" class="form-control" id="num2" placeholder="Número 2">
        </div>
        <div class="mb-2">
          <select class="form-select" id="operacion">
            <option value="sumar">Sumar</option>
            <option value="restar">Restar</option>
            <option value="multiplicar">Multiplicar</option>
            <option value="dividir">Dividir</option>
          </select>
        </div>
        <div class="mb-2 d-flex justify-content-between align-items-center">
          <button class="btn btn-primary" id="calcular" title="Haz clic para calcular">Calcular</button>
          <div id="badge-op" class="badge bg-secondary">Operación: sumar</div>
        </div>
        <div id="spinner" class="spinner-border text-primary my-2" style="display:none" role="status">
          <span class="visually-hidden">Calculando...</span>
        </div>
        <div id="resultado" class="alert alert-secondary">Resultado: </div>
      </div>
    `;
  }

  connectedCallback() {
    this.shadow.querySelector('#calcular').addEventListener('click', () => this.calcular());
    this.shadow.querySelector('#operacion').addEventListener('change', () => this.actualizarBadge());
  }

  actualizarBadge() {
    const operacion = this.shadow.querySelector('#operacion').value;
    const badge = this.shadow.querySelector('#badge-op');
    badge.textContent = 'Operación: ' + operacion;
    badge.className = 'badge bg-secondary';

    const btn = this.shadow.querySelector('#calcular');
    btn.className = 'btn';

    switch (operacion) {
      case 'sumar':
        btn.classList.add('btn-success');
        break;
      case 'restar':
        btn.classList.add('btn-warning');
        break;
      case 'multiplicar':
        btn.classList.add('btn-info');
        break;
      case 'dividir':
        btn.classList.add('btn-danger');
        break;
    }
  }

  mostrarSpinner(mostrar) {
    const spinner = this.shadow.querySelector('#spinner');
    spinner.style.display = mostrar ? 'inline-block' : 'none';
  }

  calcular() {
    const num1Input = this.shadow.querySelector('#num1');
    const num2Input = this.shadow.querySelector('#num2');
    const resultadoDiv = this.shadow.querySelector('#resultado');
    const operacion = this.shadow.querySelector('#operacion').value;

    const num1 = parseFloat(num1Input.value);
    const num2 = parseFloat(num2Input.value);

    let valido = true;

    if (isNaN(num1)) {
      num1Input.classList.add('is-invalid');
      valido = false;
    } else {
      num1Input.classList.remove('is-invalid');
      num1Input.classList.add('is-valid');
    }

    if (isNaN(num2)) {
      num2Input.classList.add('is-invalid');
      valido = false;
    } else {
      num2Input.classList.remove('is-invalid');
      num2Input.classList.add('is-valid');
    }

    if (!valido) {
      resultadoDiv.textContent = 'Resultado: Error - Ingrese números válidos';
      resultadoDiv.className = 'alert alert-danger';
      return;
    }

    if (operacion === 'dividir' && num2 === 0) {
      resultadoDiv.textContent = 'Resultado: Error - División por cero';
      resultadoDiv.className = 'alert alert-danger';
      return;
    }

    this.mostrarSpinner(true);

    setTimeout(() => {
      let resultado;
      switch (operacion) {
        case 'sumar': resultado = num1 + num2; break;
        case 'restar': resultado = num1 - num2; break;
        case 'multiplicar': resultado = num1 * num2; break;
        case 'dividir': resultado = num1 / num2; break;
      }

      resultadoDiv.textContent = 'Resultado: ' + resultado;
      resultadoDiv.className = 'alert alert-success';
      this.mostrarSpinner(false);
    }, 500);
  }
}

customElements.define('calculadora-basica', CalculadoraBasica);
