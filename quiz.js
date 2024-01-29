let preguntas = [];
let preguntaActual = 0;
let puntaje = 0;

const questionContainer = document.getElementById('question-container');
const nextBtn = document.getElementById('next-btn');
const difficultySelect = document.getElementById('difficulty-select');

async function cargarPreguntasPorDificultad(dificultad) {
  try {
    const response = await fetch('preguntas.json');
    const preguntasJson = await response.json();
    return preguntasJson[dificultad];
  } catch (error) {
    console.error('Error al cargar las preguntas', error);
    return null;
  }
}

function cargarPreguntas() {
  const dificultadSeleccionada = difficultySelect.value;
  cargarPreguntasPorDificultad(dificultadSeleccionada)
    .then(preguntasDificultad => {
      if (preguntasDificultad) {
        preguntas = preguntasDificultad;
        mostrarPregunta();
      } else {
        console.error('Dificultad no válida o preguntas no encontradas.');
      }
    });
}

function mostrarPregunta() {
  const pregunta = preguntas[preguntaActual];
  questionContainer.innerHTML = `
    <h2>${pregunta.pregunta}</h2>
    <ul>
      ${pregunta.opciones.map((opcion, index) => `<li onclick="seleccionarRespuesta(${index})">${opcion}</li>`).join('')}
    </ul>
  `;
}

function seleccionarRespuesta(indice) {
  const respuestaUsuario = preguntas[preguntaActual].opciones[indice];
  verificarRespuesta(respuestaUsuario);
}

function verificarRespuesta(respuestaUsuario) {
  const pregunta = preguntas[preguntaActual];
  if (respuestaUsuario === pregunta.respuesta_correcta) {
    puntaje++;
  }
  almacenarProgreso();
  siguientePregunta();
}

function siguientePregunta() {
  preguntaActual++;
  if (preguntaActual < preguntas.length) {
    mostrarPregunta();
  } else {
    finalizarQuiz();
  }
}

function finalizarQuiz() {
  Swal.fire({
    title: 'Quiz completado',
    text: `Tu puntaje final es: ${puntaje} de ${preguntas.length}`,
    icon: 'success'
  }).then(() => {
    reiniciarQuizConDificultad();
  });
}

function almacenarProgreso() {
  localStorage.setItem('preguntaActual', preguntaActual);
  localStorage.setItem('puntaje', puntaje);
}

function cargarProgreso() {
  const preguntaGuardada = localStorage.getItem('preguntaActual');
  const puntajeGuardado = localStorage.getItem('puntaje');

if (preguntaGuardada !== null && puntajeGuardado !== null) {
  preguntaActual = parseInt(preguntaGuardada);
  puntaje = parseInt(puntajeGuardado);
  }
}

function reiniciarQuizConDificultad() {
  localStorage.removeItem('preguntaActual');
  localStorage.removeItem('puntaje');
  preguntaActual = 0;
  puntaje = 0;
  cargarPreguntas();
}

difficultySelect.addEventListener('change', reiniciarQuizConDificultad);
nextBtn.addEventListener('click', () => {
  seleccionarRespuesta();
});
cargarProgreso();
cargarPreguntas();
