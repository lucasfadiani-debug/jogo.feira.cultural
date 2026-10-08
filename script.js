let scene;
let camera;
let renderer;

let player;

let enemies = [];
let coins = [];

let score = 0;

let gameRunning = false;

let playerLane = 1;

let targetX = 0;

let enemySpeed = 0.055;

let spawnTimer = 0;
let coinTimer = 0;

let clock;


/* FAIXAS DA ESTRADA */

const lanes = [-3, 0, 3];


/* =========================
   CRIAR JOGO
========================= */

function createGame() {

    scene = new THREE.Scene();

    scene.background = new THREE.Color(0x080b18);

    scene.fog = new THREE.Fog(
        0x080b18,
        30,
        150
    );


    /* CÂMERA */

    camera = new THREE.PerspectiveCamera(
        65,
        1,
        0.1,
        300
    );

    camera.position.set(
        0,
        7,
        12
    );

    camera.lookAt(
        0,
        0,
        -20
    );


    /* RENDERIZADOR */

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );


    const container =
        document.getElementById(
            "game-container"
        );


    container.appendChild(
        renderer.domElement
    );


    /* LUZ */

    const light =
        new THREE.HemisphereLight(
            0xffffff,
            0x222244,
            2
        );

    scene.add(light);


    /* LUZ PRINCIPAL */

    const directionalLight =
        new THREE.DirectionalLight(
            0xffffff,
            1
        );

    directionalLight.position.set(
        5,
        10,
        5
    );

    scene.add(
        directionalLight
    );


    /* CHÃO */

    const ground =
        new THREE.Mesh(

            new THREE.PlaneGeometry(
                200,
                200
            ),

            new THREE.MeshStandardMaterial({
                color: 0x080a0f
            })

        );


    ground.rotation.x =
        -Math.PI / 2;

    ground.position.y =
        -0.5;

    scene.add(
        ground
    );


    /* ESTRADA */

    const road =
        new THREE.Mesh(

            new THREE.BoxGeometry(
                12,
                0.5,
                180
            ),

            new THREE.MeshStandardMaterial({
                color: 0x282c32
            })

        );


    road.position.z = -60;

    road.position.y = -0.25;

    scene.add(
        road
    );


    /* LINHAS DA ESTRADA */

    for (
        let x of [-1.5, 1.5]
    ) {

        for (
            let z = -5;
            z > -150;
            z -= 8
        ) {

            const line =
                new THREE.Mesh(

                    new THREE.BoxGeometry(
                        0.1,
                        0.05,
                        4
                    ),

                    new THREE.MeshStandardMaterial({
                        color: 0xffffff
                    })

                );


            line.position.set(
                x,
                0,
                z
            );


            scene.add(
                line
            );
        }
    }


    /* JOGADOR */

    createPlayer();


    /* TAMANHO */

    resize();


    window.addEventListener(
        "resize",
        resize
    );
}


/* =========================
   CRIAR CARRO
========================= */

function createCar(color) {

    const car =
        new THREE.Group();


    /* CORPO */

    const body =
        new THREE.Mesh(

            new THREE.BoxGeometry(
                1.8,
                0.7,
                3.2
            ),

            new THREE.MeshStandardMaterial({
                color: color
            })

        );


    body.position.y = 0.6;

    car.add(
        body
    );


    /* VIDROS */

    const windows =
        new THREE.Mesh(

            new THREE.BoxGeometry(
                1.3,
                0.5,
                1.5
            ),

            new THREE.MeshStandardMaterial({
                color: 0x111827
            })

        );


    windows.position.y = 1;

    car.add(
        windows
    );


    return car;
}


/* =========================
   JOGADOR
========================= */

function createPlayer() {

    player =
        createCar(
            0x35d7ff
        );


    player.position.set(
        0,
        0,
        5
    );


    scene.add(
        player
    );


    targetX = 0;
}


/* =========================
   INIMIGO
========================= */

function createEnemy() {

    const enemy =
        createCar(
            0xe83d55
        );


    const lane =
        Math.floor(
            Math.random() * 3
        );


    enemy.position.set(
        lanes[lane],
        0,
        -80
    );


    enemy.userData.lane =
        lane;


    scene.add(
        enemy
    );


    enemies.push(
        enemy
    );
}


/* =========================
   MOEDA
========================= */

function createCoin() {

    const coin =
        new THREE.Mesh(

            new THREE.TorusGeometry(
                0.55,
                0.15,
                12,
                24
            ),

            new THREE.MeshStandardMaterial({
                color: 0xffd43b
            })

        );


    const lane =
        Math.floor(
            Math.random() * 3
        );


    coin.position.set(
        lanes[lane],
        1,
        -80
    );


    coin.userData.lane =
        lane;


    scene.add(
        coin
    );


    coins.push(
        coin
    );
}


/* =========================
   INICIAR JOGO
========================= */

function startGame() {

    enemies.forEach(
        enemy =>
            scene.remove(enemy)
    );


    coins.forEach(
        coin =>
            scene.remove(coin)
    );


    enemies = [];
    coins = [];


    score = 0;

    playerLane = 1;

    targetX = 0;


    player.position.x = 0;


    enemySpeed = 0.055;


    spawnTimer = 1.5;

    coinTimer = 1.5;


    document.getElementById(
        "score"
    ).innerText = "0";


    document.getElementById(
        "start-screen"
    ).classList.add(
        "hidden"
    );


    document.getElementById(
        "game-over-screen"
    ).classList.add(
        "hidden"
    );


    gameRunning = true;

    clock.start();
}


/* =========================
   GAME OVER
========================= */

function gameOver() {

    gameRunning = false;


    document.getElementById(
        "final-score"
    ).innerText =
        Math.floor(score);


    document.getElementById(
        "game-over-screen"
    ).classList.remove(
        "hidden"
    );
}


/* =========================
   MOVIMENTO
========================= */

function moveLeft() {

    if (!gameRunning)
        return;


    playerLane--;


    if (playerLane < 0)
        playerLane = 0;


    targetX =
        lanes[playerLane];
}


function moveRight() {

    if (!gameRunning)
        return;


    playerLane++;


    if (playerLane > 2)
        playerLane = 2;


    targetX =
        lanes[playerLane];
}


/* =========================
   TECLADO
========================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "ArrowLeft" ||
            event.key.toLowerCase() === "a"
        ) {

            moveLeft();

        }


        if (
            event.key === "ArrowRight" ||
            event.key.toLowerCase() === "d"
        ) {

            moveRight();

        }

    }
);


/* =========================
   ATUALIZAR JOGO
========================= */

function update() {

    if (!gameRunning)
        return;


    const delta =
        Math.min(
            clock.getDelta(),
            0.033
        );


    /* PONTUAÇÃO */

    score +=
        delta * 7;


    document.getElementById(
        "score"
    ).innerText =
        Math.floor(score);


    /* AUMENTAR VELOCIDADE */

    enemySpeed =
        Math.min(
            0.13,
            0.055 +
            score * 0.00004
        );


    /* MOVIMENTO DO JOGADOR */

    player.position.x +=
        (
            targetX -
            player.position.x
        ) * 0.12;


    /* INIMIGOS */

    spawnTimer -= delta;


    if (spawnTimer <= 0) {

        createEnemy();

        spawnTimer = 2.2;
    }


    /* MOEDAS */

    coinTimer -= delta;


    if (coinTimer <= 0) {

        createCoin();

        coinTimer =
            2 +
            Math.random();
    }


    /* MOVER INIMIGOS */

    enemies.forEach(
        enemy => {

            enemy.position.z +=
                enemySpeed;

        }
    );


    /* MOVER MOEDAS */

    coins.forEach(
        coin => {

            coin.position.z +=
                enemySpeed * 0.8;

            coin.rotation.y +=
                0.05;

        }
    );


    /* REMOVER INIMIGOS */

    enemies =
        enemies.filter(
            enemy => {

                if (
                    enemy.position.z > 20
                ) {

                    scene.remove(
                        enemy
                    );

                    return false;
                }


                return true;
            }
        );


    /* REMOVER MOEDAS */

    coins =
        coins.filter(
            coin => {

                if (
                    coin.position.z > 20
                ) {

                    scene.remove(
                        coin
                    );

                    return false;
                }


                return true;
            }
        );


    /* COLISÃO */

    enemies.forEach(
        enemy => {

            const distance =
                player.position.distanceTo(
                    enemy.position
                );


            if (
                distance < 2.3
            ) {

                gameOver();

            }

        }
    );


    /* PEGAR MOEDAS */

    for (
        let i = coins.length - 1;
        i >= 0;
        i--
    ) {

        const distance =
            player.position.distanceTo(
                coins[i].position
            );


        if (
            distance < 1.8
        ) {

            score += 35;


            scene.remove(
                coins[i]
            );


            coins.splice(
                i,
                1
            );
        }
    }
}


/* =========================
   LOOP
========================= */

function animate() {

    requestAnimationFrame(
        animate
    );


    update();


    if (renderer) {

        renderer.render(
            scene,
            camera
        );

    }
}


/* =========================
   REDIMENSIONAR
========================= */

function resize() {

    const area =
        document.getElementById(
            "game-container"
        );


    if (!area)
        return;


    const width =
        area.clientWidth;


    const height =
        area.clientHeight;


    if (
        width === 0 ||
        height === 0
    )
        return;


    camera.aspect =
        width / height;


    camera.updateProjectionMatrix();


    renderer.setSize(
        width,
        height
    );
}


/* =========================
   BOTÕES
========================= */

document.getElementById(
    "start-button"
).addEventListener(
    "click",
    startGame
);


document.getElementById(
    "restart-button"
).addEventListener(
    "click",
    startGame
);


document.getElementById(
    "left-button"
).addEventListener(
    "click",
    moveLeft
);


document.getElementById(
    "right-button"
).addEventListener(
    "click",
    moveRight
);


/* =========================
   INICIAR
========================= */

createGame();

animate();
