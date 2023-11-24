console.log('Flappy Bird');

let frames = 0;
const som_HIT = new Audio();
som_HIT.src = 'hit.wav';//som de colisao, falta arquivo

const sprites = new Image();
sprites.src = 'sprites.png'//sprites do game

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');


//Plano de fundo no sprite
const planoDeFundo = {
	spriteX: 390,
	spriteY: 0,
	largura: 275,
	altura: 204,
	x: 0,
	y: canvas.height - 204,
	desenha() {
		contexto.fillStyle = '#70c5ce';
		contexto.fillRect(0, 0, canvas.width, canvas.height);

		contexto.drawImage(//dando o comando para desenhar o plano de fundo na tela
			sprites,
			planoDeFundo.spriteX, planoDeFundo.spriteY,
			planoDeFundo.largura, planoDeFundo.altura,
			planoDeFundo.x, planoDeFundo.y,
			planoDeFundo.largura, planoDeFundo.altura,
		);

		contexto.drawImage(//repetindo o comando para desenhar o plano de fudno na tela, para completar o tamanho da imagem no canvas
			sprites,
			planoDeFundo.spriteX, planoDeFundo.spriteY,
			planoDeFundo.largura, planoDeFundo.altura,
			(planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
			planoDeFundo.largura, planoDeFundo.altura,
		);
	},
};

//CHAO
//pegando os posicionamentos do sprite do chao
function criaChao() {
	const chao = {
		spriteX: 0,
		spriteY: 610,
		largura: 224,
		altura: 112,
		x: 0,
		y: canvas.height - 112,
		atualiza() {
			const movimentoDoChao = 1;
			const repeteEm = chao.largura / 2;
			const movimentacao =  chao.x - movimentoDoChao;

			chao.x = movimentacao % repeteEm;
		},
		//dando o comando para desenhar o chao na tela
		desenha() {
			contexto.drawImage(
				sprites,
				chao.spriteX, chao.spriteY,
				chao.largura, chao.altura,
				chao.x, chao.y,				
				chao.largura, chao.altura,
			);
			//repetindo o comando para desenhar o chao na tela, para completar o tamanho da imagem no canvas
			contexto.drawImage(
				sprites,
				chao.spriteX, chao.spriteY,
				chao.largura, chao.altura,
				(chao.x + chao.largura), chao.y,
				chao.largura, chao.altura,
			);
		},
	};
	return chao;
}

//funcao de colisao com o chao
function fazColisao(flappyBird, chao) {
	const flappyBirdY = flappyBird.y + flappyBird.altura;
	const chaoY = chao.y;

	if(flappyBirdY >= chaoY) {
		
		mudaParaTela(telas.INICIO)
		

	}
	return false
};

//comandos/estrutura do personagem flappy bird
function criaFlappyBird() {
	const flappyBird = { //localizacao no sprite do passaro
		spriteX: 0,
		spriteY: 0,
		largura: 33,
		altura: 24,
		x: 10,
		y: 50, //fim localizacao sprite do passaro
		pulo: 4.6, //variavel para diminuir o valor da velocidade de queda com o pulo, padrao 4.6
		pula() {
			flappyBird.velocidade = - flappyBird.pulo;
		},
		gravidade: 0.25, //gravidade do boneco padrao 0.25
		velocidade: 0, //velocidade de inicio da queda, padrao 0
		atualiza() {
			if(fazColisao(flappyBird, globais.chao)) {
				console.log('fez colisao');
				som_HIT();

				setTimeout(() => {
					mudaParaTela(telas.INICIO);
				}, 500);				
				return;
			}
			flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
			flappyBird.y = flappyBird.y + flappyBird.velocidade;
		},
		movimentos: [
			{spriteX: 0, spriteY: 0,}, //asa pra cima
			{spriteX: 0, spriteY: 26,}, //asa no meio
			{spriteX: 0, spriteY: 52,}, //asa pra baixo
			{spriteX: 0, spriteY: 26,}, //asa no meio
		],
		frameAtual: 0,
		atualizaOFrameAtual() {
			const intervaloDeFrames = 10;
			const passouOIntervalo = frames % intervaloDeFrames === 0;

			if(passouOIntervalo) {
				const baseDoIncremento = 1;
				const incremento = baseDoIncremento + flappyBird.frameAtual;
				const baseRepeticao = flappyBird.movimentos.length;
				flappyBird.frameAtual = incremento % baseRepeticao
			}
		},
		desenha() {
			flappyBird.atualizaOFrameAtual();
			const {spriteX, spriteY} = flappyBird.movimentos[flappyBird.frameAtual];
			contexto.drawImage(
				sprites, 
				spriteX, spriteY, //sprite x, sprite y dentro do arquivo sprites
				flappyBird.largura, flappyBird.altura, //tamanho do recorte na sprite
				flappyBird.x, flappyBird.y, 
				flappyBird.largura, flappyBird.altura
			);
		},
	}
	return flappyBird;
}



//Tela de Inicio do game
const mensagemGetReady = {
	spriteX: 134,
	spriteY: 0,
	largura: 174,
	altura: 152,
	x: (canvas.width / 2) - 174/2,
	y: 50,
	desenha() {
		contexto.drawImage(
			sprites,
			mensagemGetReady.spriteX, mensagemGetReady.spriteY,
			mensagemGetReady.largura, mensagemGetReady.altura,
			mensagemGetReady.x, mensagemGetReady.y,
			mensagemGetReady.largura, mensagemGetReady.altura
		);
	},
};

function criaCanos() {//funcao para criar os canos
	const canos = {
		largura: 52,
		altura: 400,
		chao: {
			spriteX: 0,
			spriteY: 169,
		},
		ceu: {
			spriteX: 52,
			spriteY: 169,
		},
		espaco: 80,
		desenha() {//comando para desenhar os canos
			canos.pares.forEach(function(par) {
			const yRandom = par.y;
			const espacamentoEntreCanos = 90; //espacamento entre os canos padrao 90
				//cano do ceu
			const canoCeuX = par.x;
			const canoCeuY = yRandom;
			contexto.drawImage(
				sprites,
				canos.ceu.spriteX, canos.ceu.spriteY,
				canos.largura, canos.altura,
				canoCeuX, canoCeuY,
				canos.largura, canos.altura,
				)

			//cano do chao
			const canoChaoX = par.x;
			const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom;
			contexto.drawImage(
				sprites,
				canos.chao.spriteX, canos.chao.spriteY,
				canos.largura, canos.altura,
				canoChaoX, canoChaoY,
				canos.largura, canos.altura,
				)

				par.canoCeu = {
					x:canoCeuX,
					y: canos.altura + canoCeuY
				}

				par.canoChao = {
					x: canoChaoX,
					y: canoChaoY
				}
			})
		},

		temColisaoComOFlappyBird(par) {//comando de colisao do passaro com os canos
			const cabecaDoFlappy = globais.flappyBird.y;
			const peDoFlappy = globais.flappyBird.y + globais.flappyBird.altura;

			if(globais.flappyBird.x >= par.x) {
				if(cabecaDoFlappy <= par.canoCeu.y) { //colisao com os canos de cima
					return true;
				}

				if(peDoFlappy >= par.canoChao.y) {//colisao com os canos de baixo
					return true;
				}
			}
			return false;
		},			
		
		pares: [],
		atualiza() {//random de criacao dos canos
			const passou100Frames = frames % 100 === 0;
			if(passou100Frames) {
				canos.pares.push({
					x: canvas.width,
					y: -150 * (Math.random() + 1),
				})
			}
		

			canos.pares.forEach(function(par) {
				par.x = par.x - 2;

				if(canos.temColisaoComOFlappyBird(par)) {
					mudaParaTela(telas.INICIO);//comando para voltar a tela incial do game em caso de colisao com o canos
				}

				if(par.x + canos.largura <= 0) {
					canos.pares.shift();//comando para apagar os canos apos passar do limite da tela
				}
			});

		}
	}

	return canos;
}

//
//TELAS
//
const globais = {};//telas globais
let telaAtiva = {};
function mudaParaTela(novaTela) {
	telaAtiva = novaTela;

	if(telaAtiva.inicializa) {
		telaAtiva.inicializa();
	}
	
};

const telas = {
	INICIO: {
		inicializa() {
			globais.flappyBird = criaFlappyBird();
			globais.chao = criaChao();
			globais.canos = criaCanos();
		},
		desenha() {
			planoDeFundo.desenha();
			globais.flappyBird.desenha();
			globais.canos.desenha();
			globais.chao.desenha();
			mensagemGetReady.desenha();
		},
		click() {
			mudaParaTela(telas.JOGO)
		},
		atualiza() {
			globais.chao.atualiza();
		}
	}
};

telas.JOGO = {
	desenha() { //da o comando para desenhar
		planoDeFundo.desenha();
		globais.canos.desenha();
		globais.chao.desenha();
		globais.flappyBird.desenha();
	},
	click() { //comando pula
		globais.flappyBird.pula();
	},
	atualiza() { //da o comando para atualizar as informacoes
		globais.canos.atualiza();
		globais.flappyBird.atualiza();
		globais.chao.atualiza();
	}
};	

function loop() {

	telaAtiva.desenha();
	telaAtiva.atualiza();

	frames = frames + 1;
	requestAnimationFrame(loop);
}

window.addEventListener('click', function() {
	if(telaAtiva.click) {
		telaAtiva.click();
	}
});

mudaParaTela(telas.INICIO);
loop();