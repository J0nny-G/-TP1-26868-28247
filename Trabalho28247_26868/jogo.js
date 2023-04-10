        var config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            physics:{
                default: 'arcade',
                arcade: {
               
                debug: false
            }
        },
        scene: {
        preload: preload,
        create: create,
        update: update
        }
    }

    var player;
    var Carro1;
    var cursors;
    var barra;
    var perdeu = false; 
    var gameover;
    var transito;
    var pontuacao=0;
    var nivel=1;
    var carros;
    var carro;
    var velocidadeCarros = 200; 
    var nivel = 1; 
    var vidas = 3;
    var rKey;


    var game = new Phaser.Game(config);
    
    function preload(){
        this.load.image('estrada', 'assets/estrada.png');
        this.load.image('f1', 'assets/f2.png',{frameWidth:32, frameHeight:48});
        this.load.image('Carro1', 'assets/Carro1.png');
        this.load.image('Obstaculo', 'assets/Obstaculo.png');
        this.load.image('linha', 'assets/linha.png');
    }

    function create (){

        // Imagens do jogo
        this.add.image(400,300, 'estrada');
        player = this.physics.add.sprite(600,480, 'f1')

        
        barra = this.physics.add.staticGroup();

        barra.create(702,300,'Obstaculo');
        barra.create(106,300,'Obstaculo');

        cursors = this.input.keyboard.createCursorKeys();

        pontuacaoTexto = this.add.text(16, 16, 'Pontuação: 0', { fontSize: '32px', fill: '#fff' });
        nivelTexto = this.add.text(16, 50, 'Nivel: 1', { fontSize: '32px', fill: '#fff' });
        textoVidas = this.add.text(16, 80, 'Vidas: ' + vidas, { fontSize: '32px', fill: '#fff' });

        // Colisao contra as paredes
        this.physics.add.collider(player,barra);

        player.setCollideWorldBounds(true);
        
        carros = this.physics.add.group();

        //Colisao entre carros
        this.physics.add.collider(player,carros, acidente , null , this);

        //Cria uma linha
        var linha = this.physics.add.sprite(100, 620, 'linha');
        linha.setScale(800, 1);
        linha.body.allowGravity = false;
        linha.body.immovable = true;
        //Ao passar na linha aumenta a pontuacao
        this.physics.add.collider(linha, carros, function(linha, carro){
            pontuacao++;
            pontuacaoTexto.setText('Pontuação: ' + pontuacao);
            carro.destroy();
        });

         transito = this.time.addEvent({
            delay: 1500 / nivel,
            callback: cairCarros,
            callbackScope: this,
            loop: true

         });

         rKey = this.input.keyboard.addKey('R');
    }
    

    function update (){
        if(perdeu){
            return;
        }
        if (cursors.left.isDown){
            player.setVelocityX(-1000);
        }        
        else if (cursors.right.isDown){
            player.setVelocityX(1000);
        }else if (cursors.up.isDown ){
            player.setVelocityY(-1000);
            player.setGravity=false;A
        }else if (cursors.down.isDown){
            player.setVelocityY(1000);
            player.setGravity=false;
        }
        else {
            player.setVelocity(0);
        }
        textoVidas.setText('Vidas: ' + vidas);
        if(rKey.isDown){
            vidas = 10;
            textoVidas.setText('Vidas: ' + vidas);
        }
    }

    function cairCarros() {
        for (var i = 0; i < nivel; i++) {
            var randomX = Phaser.Math.Between(140, 680);
            carro = carros.create(randomX, -50, 'Carro1');
            carro.setVelocityY(velocidadeCarros); // Configura velocidade 
        }
        if (pontuacao >= 10 && nivel < 2) {
            aumentarNivel();
            nivelTexto.setText('Nivel: ' + nivel);
        } else if (pontuacao >= 30 && nivel < 3) {
            aumentarNivel();
            nivelTexto.setText('Nivel: ' + nivel);
        } else if (pontuacao >= 60 && nivel < 4) {
            aumentarNivel();
            nivelTexto.setText('Nivel: ' + nivel);
        }
    }

    function aumentarNivel() {
        nivel++;
        velocidadeCarros += 50 * nivel; // Aumentar velocidade
    }


    function acidente(player, cairCarros) {
        vidas = vidas - 1;
        textoVidas.setText('Vidas: ' +vidas);

        if (vidas == 0) {
            this.physics.pause();
            // desenha a caixa
            var caixa = this.add.graphics();
            caixa.fillStyle(0x000000, 0.7);
            caixa.fillRect(250, 200, 300, 100);
            caixa.lineStyle(4, 0xffa500);
            caixa.strokeRect(250, 200, 300, 100);

            // adiciona a mensagem
            gameover = this.add.text(400, 225, 'Larga o telemóvel \nPontuação: ' + pontuacao, { fontSize: '26px', fill: '#FFA500', fontStyle: 'bold' });
            gameover.setOrigin(0.5);

            player.setTint(0xff0000);
            perdeu = true;
            transito.remove(false);
        }
        cairCarros.disableBody(true,true);
    }