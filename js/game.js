$(document).ready(function(){
	var jogo = new JogoDaVelha;
	jogo.iniciarJogo(); 

	$('.espaco').click(function(){
		jogo.fazerJogada(parseInt(this.id));
	})

	$('#jogar-novamente').click(function(){
		jogo.iniciarJogo();
	})
})

var JogoDaVelha = function(){
	this.tabuleiro;
	this.jogadores = [];
	this.simbolos = ['X','O'];
	this.jogadorDaVez;
	this.jogoFinalizado;

	this.iniciarJogo = function(){
		this.limparTabuleiro();
		this.jogoFinalizado = false;

		swal({
			text: 'É preciso de dois jogadores para que o jogo comece. Digite o nome do primeiro jogador:',
			content: "input",
			button: {
				text: "Próximo!",
			},
		}).then(nomeJogador1 => {
			if(nomeJogador1 != "" && nomeJogador1 != undefined && nomeJogador1 != null){
				swal({
					text: 'Digite o nome do segundo jogador:',
					content: "input",
					button: {
						text: "Próximo!",
					},
				}).then(nomeJogador2 => {
					if(nomeJogador2 != '' && nomeJogador2 != undefined && nomeJogador2 != null){
						var jogador1 = new Jogador(nomeJogador1);
						var jogador2 = new Jogador(nomeJogador2);

						this.jogadores = [jogador1, jogador2];
						swal('Sorteio!','Iremos sortear um dos jogadores para iniciar a partida e escolher primeiro seu símbolo','info').then(() => {
							this.sortearInicioJogo();
						})
					}else{
						this.iniciarJogo();
					}
				});
			}else{
				this.iniciarJogo();	
			}
		})
	}

	this.limparTabuleiro = function(){
		this.tabuleiro = ['','','','','','','','',''];
		$('.simbolo h2').html('');
	}

	this.sortearInicioJogo = function(){
		var sorteio = Math.random() * (1 - 0 + 1) + 0;

		if(sorteio > 1){
			var jogadorSorteado = this.jogadores[0];
			var jogadorNaoSorteado = this.jogadores[1];
		}else{
			var jogadorSorteado = this.jogadores[1];
			var jogadorNaoSorteado = this.jogadores[0];
		}

		swal('Sorteado!', `O jogador sorteado foi ${jogadorSorteado.getNome()}`,'success').then(() => {
			swal(`${jogadorSorteado.getNome()}, qual símbolo você quer escolher?`, {
				buttons: {
					simbolo_1: {
						text: this.simbolos[0],
						value: this.simbolos[0],
					},
					simbolo_2: {
						text: this.simbolos[1],
						value: this.simbolos[1],
					},
				},
			}).then(simbolo => {
				jogadorSorteado.setSimbolo(simbolo);

				if(simbolo == this.simbolos[0]){
					jogadorNaoSorteado.setSimbolo(this.simbolos[1]);
				}else{
					jogadorNaoSorteado.setSimbolo(this.simbolos[0]);
				}

				$('#jogo').removeClass('fade');
				$('#jogar-novamente').addClass('fade');
				this.jogadorDaVez = jogadorSorteado;
			})
		});
	}

	this.fazerJogada = function(posicao){
		if(this.jogoFinalizado){
			swal('Ops','Você precisa reniciar para jogar outra partida.','info');
		}else{
			if(this.tabuleiro[posicao] == ''){
				this.tabuleiro[posicao] = this.jogadorDaVez.getSimbolo();
				$('#' + posicao + ' .simbolo h2').html(this.jogadorDaVez.getSimbolo());
				this.verificarVitoria();
				this.verificarVelha();
				this.alterarJogador();
			}else{
				swal('Ops','Posição já foi preenchida','error');
			}
		}
	}

	this.alterarJogador = function(){
		if(this.jogadorDaVez == this.jogadores[0]){
			this.jogadorDaVez = this.jogadores[1];
		}else{
			this.jogadorDaVez = this.jogadores[0];
		}
	}

	this.verificarVitoria = function(){
		var combinacoesDeVitoria = [
			[0,1,2],
			[3,4,5],
			[6,7,8],
			[0,3,6],
			[1,4,7],
			[2,5,8],
			[0,4,8],
			[6,4,2]
		];

		for(i in combinacoesDeVitoria){
			var combinacaoAtual = combinacoesDeVitoria[i];

			var posicaoUm = combinacaoAtual[0];
			var posicaoDois = combinacaoAtual[1];
			var posicaoTres = combinacaoAtual[2];

			if(this.tabuleiro[posicaoUm] == this.tabuleiro[posicaoDois] && 
				this.tabuleiro[posicaoDois] == this.tabuleiro[posicaoTres] && 
				this.tabuleiro[posicaoUm] != '' &&
				this.tabuleiro[posicaoDois] != '' &&
				this.tabuleiro[posicaoTres] != ''){
				swal('Vitória!',`Parabéns ${this.jogadorDaVez.getNome()}! Você venceu.`,'success');
				this.alterarJogador();
				this.jogoFinalizado = true;

				var nomePerdedor = this.jogadorDaVez.getNome();

				setTimeout(function(){
					swal('Derrota!',`${nomePerdedor}, infelizmente você perdeu.`,'error')
				}, 2000);
				
				$('#jogar-novamente').removeClass('fade');
			}
		}
	}

	this.verificarVelha = function(){
		if(!this.tabuleiro.includes('')){
			swal('Empate','Deu velha.','info');
			this.jogoFinalizado = true;
			$('#jogar-novamente').removeClass('fade');
		}
	}
} 

var Jogador = function(nome){
	this.nome = nome;
	this.simbolo;

	this.setSimbolo = function(simbolo){
		this.simbolo = simbolo;
	}

	this.getNome = function(){
		return this.nome;
	}

	this.getSimbolo = function(){
		return this.simbolo;
	}
}