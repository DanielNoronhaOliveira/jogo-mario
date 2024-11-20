const personagem = document.getElementById("personagem")
const cenario = document.getElementById("cenario")
const botaoReiniciar = document.getElementById("reiniciar")
const botaoIniciar = document.getElementById("iniciar")

const inimigo = document.getElementById("inimigo")
const bloco = document.getElementById("bloco")
const tempo = document.getElementById("tempo")
const vidas = document.getElementById("vidas")
const moedas = document.getElementById("moedas")
const pontos = document.getElementById("pontos")

const larguraCenario = cenario.offsetWidth
const larguraPersonagem = personagem.offsetWidth

let posicao = 0
let direcao = 0
let velocidade = 12

let tempoAtual = 400

let vidasAtual = parseInt(localStorage.getItem("vidasAtual")) || 5  // faz com que os item fiquem salvo no local storage
vidas.textContent = vidasAtual

let moedasAtual = parseInt(localStorage.getItem("moedasAtual")) || 0  // faz com que os item fiquem salvo no local storage
moedas.textContent = moedasAtual

let pontosAtual = parseInt(localStorage.getItem("pontosAtual")) || 0  // faz com que os item fiquem salvo no local storage
pontos.textContent = pontosAtual

let checarMovimentos
let checarColisaoComInimigo
let checarColisaoComBloco
let checarRelogio
let checarPulo

let estaPulando = false
let colidiu = false
let jogoIniciado = false


function teclaPrecionada(event) {
 

  if (event.key === "ArrowRight") {
    direcao = 1
    personagem.style.backgroundImage = "url(/assets/marioAndandoLadoDireito.gif"
  } else if (event.key === "ArrowLeft") {
    direcao = -1
    personagem.style.backgroundImage = "url(/assets/marioAndandoLadoEsquerdo.gif"
  } else if (event.code === "Space") {
    if (!estaPulando) {
      estaPulando = true
      personagem.classList.add("puloPersonagem")
      checarPulo = setTimeout(() => {
        personagem.classList.remove("puloPersonagem")
        estaPulando = false  //pulo concluido
      }, 500)
    }
  }
}

function teclaSolta(event) {
  if (event.key === "ArrowRight") {
    direcao = 0
    personagem.style.backgroundImage = "url(/assets/marioParadoLadoDireito.png"
  } else if (event.key === "ArrowLeft") {
    direcao = 0
    personagem.style.backgroundImage = "url(/assets/marioParadoLadoEsquerdo.png"
  }

}

function atualizarMovimentos() {
  

  // Atualiza a posição do personagem
  posicao += direcao * velocidade


  // Impede que o personagem saia do limite esquerdo e direito do cenário
  if (posicao < 0) {
    posicao = 0
  } else if (posicao > larguraCenario - larguraPersonagem) {
    posicao = larguraCenario - larguraPersonagem
  }
  personagem.style.left = posicao + "px"
}

function colisaoComBloco() {
  const checarPersonagem = personagem.getBoundingClientRect()
  const checarBloco = bloco.getBoundingClientRect()

  if (
    checarBloco.left < checarPersonagem.right &&
    checarBloco.right > checarPersonagem.left &&
    checarBloco.top < checarPersonagem.bottom &&
    checarBloco.left > checarPersonagem.top &&
    estaPulando  // Verifica se está pulando

  ) {
    clearInterval(checarColisaoComBloco)
    moedasAtual++
    moedas.textContent = moedasAtual
    localStorage.setItem("moedasAtual", moedasAtual)
    pontosAtual += +10
    pontos.textContent = pontosAtual
    localStorage.setItem("pontosAtual", pontosAtual)
    checarMoedas()
    setTimeout(() => {
      estaPulando = false
      checarColisaoComBloco = setInterval(colisaoComBloco, 10)
    }, 500)
  }
}

function colisaoComInimigo() {
    

  const checarPersonagem = personagem.getBoundingClientRect()
  const checarInimigo = inimigo.getBoundingClientRect()

  if (
    checarInimigo.left < checarPersonagem.right &&
    checarInimigo.right > checarPersonagem.left &&
    checarInimigo.top < checarPersonagem.bottom &&
    checarInimigo.bottom > checarPersonagem.top

  ) {
    clearInterval(checarMovimentos)
    clearTimeout(checarPulo)
    removerTeclas()
    clearInterval(checarRelogio)
    clearInterval(checarColisaoComInimigo)
    vidasAtual--
    vidas.textContent = vidasAtual
    localStorage.setItem("vidasAtual", vidasAtual)
    personagem.style.backgroundImage = "url(/assets/marioMorto.gif "
    inimigo.style.display = "none"
    colidiu = true
    setTimeout(() => {
      checarJogo()
    }, 2500)
  }
}

botaoReiniciar.addEventListener("click", function () {
  moedasAtual = 0
  moedas.textContent = moedasAtual
  localStorage.setItem("moedasAtual", moedasAtual)
  pontosAtual = 0
  pontos.textContent = pontosAtual
  localStorage.setItem("pontosAtual", pontosAtual)
  vidasAtual = 5
  vidas.textContent = vidasAtual
  localStorage.setItem("vidasAtual", vidasAtual)
  location.reload() // atualiza a pagina 

})

function checarMoedas() {
  if (moedasAtual === 100) {  // quando chegar a 100 moedas ganha uma vida
    moedasAtual = 0
    moedas.textContent = moedasAtual
    vidasAtual++
    vidas.textContent = vidasAtual
  }
}

function relogio() {  // funcao do tempo de jogo
   

  tempoAtual--
  tempo.textContent = tempoAtual
  if (tempoAtual === 100) {
    alert("o tempo estar acabando")
  } else if (tempoAtual === 0) {
    clearInterval(checarRelogio)
    removerTeclas()
    personagem.style.backgroundImage = "url(/assets/marioMorto.gif "
    inimigo.style.display = "none"  // faz com que o inimigo pare de se mover
  }
}

function checarJogo() {  // funcao para recarrega a pagina e comecar o jogo novamente
  

  if (vidasAtual >= 1) {
    location.reload()
  } else {
    botaoReiniciar.style.display = "block"
  }
}

function removerTeclas() {
    
  document.removeEventListener("keydown", teclaPrecionada)
  document.removeEventListener("keyup", teclaSolta)
}



botaoIniciar.addEventListener("click", function () {
  

  botaoIniciar.style.display = "none"
  inimigo.classList.add("animarInimigo")
  document.addEventListener("keydown", teclaPrecionada)
  document.addEventListener("keyup", teclaSolta)
  checarMovimentos = setInterval(atualizarMovimentos, 50)
  checarColisaoComBloco = setInterval(colisaoComBloco, 10)
  checarColisaoComInimigo = setInterval(colisaoComInimigo, 10)
  checarRelogio = setInterval(relogio, 1000)
  jogoIniciado = true
})

document.addEventListener("keydown", function (event) {
  if (!jogoIniciado && event.key === "Enter") {
    botaoIniciar.style.display = "none"
    inimigo.classList.add("animarInimigo")
    document.addEventListener("keydown", teclaPrecionada)
    document.addEventListener("keyup", teclaSolta)
    checarMovimentos = setInterval(atualizarMovimentos, 50)
    checarColisaoComBloco = setInterval(colisaoComBloco, 10)
    checarColisaoComInimigo = setInterval(colisaoComInimigo, 10)
    checarRelogio = setInterval(relogio, 1000)
    jogoIniciado = true
  } else if (!jogoIniciado && event.key === "Enter") {
    alert("Jogo ja foi iniciado")
  }
})

