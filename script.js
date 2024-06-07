// Inicialização e Configuração do Canvas
const TamanhoCelula = 10;
const EspacoBorda = 2;

const canvas = document.getElementById('gameCanvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const TamanhoTabuaHorizontal = Math.floor(canvas.width / (TamanhoCelula + EspacoBorda));
const TamanhoTabuaVertical = Math.floor(canvas.height / (TamanhoCelula + EspacoBorda));

const ctx = canvas.getContext('2d');

let tabua = Array(TamanhoTabuaVertical).fill().map(() => Array(TamanhoTabuaHorizontal).fill(0));

let isMouseDown = false;

canvas.addEventListener('mousedown', function(event) {
    isMouseDown = true;
    ativarHover();
});

canvas.addEventListener('mouseup', function(event) {
    isMouseDown = false;
    desativarHover();
});

function ativarHover() {
    canvas.addEventListener('mousemove', hoverAtivado);
}

function desativarHover() {
    canvas.removeEventListener('mousemove', hoverAtivado);
}

function hoverAtivado(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const i = Math.floor(y / (TamanhoCelula + EspacoBorda));
    const j = Math.floor(x / (TamanhoCelula + EspacoBorda));

    tabua[i][j] = 1;
    desenharTabua();
}

function desenharTabua() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < TamanhoTabuaVertical; i++) {
        for (let j = 0; j < TamanhoTabuaHorizontal; j++) {
            ctx.fillStyle = tabua[i][j] === 1 ? '#000' : '#9d9d9d';
            ctx.fillRect(
                j * (TamanhoCelula + EspacoBorda),
                i * (TamanhoCelula + EspacoBorda),
                TamanhoCelula,
                TamanhoCelula
            );
        }
    }
}

function calcularProximoEstado() {
    let proximoEstado = Array(TamanhoTabuaVertical).fill().map(() => Array(TamanhoTabuaHorizontal).fill(0));

    for (let i = 0; i < TamanhoTabuaVertical; i++) {
        for (let j = 0; j < TamanhoTabuaHorizontal; j++) {
            let vizinhosVivos = contarVizinhosVivos(i, j);

            if (tabua[i][j] === 1) {
                if (vizinhosVivos === 2 || vizinhosVivos === 3) {
                    proximoEstado[i][j] = 1;
                } else {
                    proximoEstado[i][j] = 0;
                }
            } else {
                if (vizinhosVivos === 3) {
                    proximoEstado[i][j] = 1;
                }
            }
        }
    }

    tabua = proximoEstado;
}

function contarVizinhosVivos(x, y) {
    let vizinhos = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const posX = x + i;
            const posY = y + j;
            if (posX >= 0 && posX < TamanhoTabuaVertical && posY >= 0 && posY < TamanhoTabuaHorizontal) {
                vizinhos += tabua[posX][posY];
            }
        }
    }
    return vizinhos;
}

let intervalId;

function iniciarSimulacao() {
    if (!intervalId) {
        intervalId = setInterval(() => {
            calcularProximoEstado();
            desenharTabua();
        }, 500);
    }
}

function pausarSimulacao() {
    clearInterval(intervalId);
    intervalId = null;
}

function resetarSimulacao() {
    pausarSimulacao();
    tabua = Array(TamanhoTabuaVertical).fill().map(() => Array(TamanhoTabuaHorizontal).fill(0));
    desenharTabua();
}

document.getElementById('startButton').addEventListener('click', iniciarSimulacao);
document.getElementById('pauseButton').addEventListener('click', pausarSimulacao);
document.getElementById('resetButton').addEventListener('click', resetarSimulacao);

desenharTabua();
