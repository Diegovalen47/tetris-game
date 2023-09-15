<script setup lang="ts">
import { ref } from "vue";
import { Piece, Cell } from "./models/pieza";

const piezas = [
  new Piece(
    'L', 
    new Cell(1,1), 
    [new Cell(0,0), new Cell(1,0), new Cell(1,1), new Cell(1,2)], 
    'red'
  ),
  new Piece(
    'T', 
    new Cell(1,1), 
    [new Cell(0,1), new Cell(1,0), new Cell(1,1), new Cell(1,2)], 
    'blue'
  ),
  new Piece(
    '|', 
    new Cell(0, 2), 
    [new Cell(0,0), new Cell(0, 1), new Cell(0, 2), new Cell(0, 3), new Cell(0, 4)], 
    'yellow'
  ),
  new Piece(
    's', 
    new Cell(1,1), 
    [new Cell(1,0), new Cell(1,1), new Cell(0, 1), new Cell(0,2)], 
    'green'
  ),
  new Piece(
    'square', 
    new Cell(1,1), 
    [new Cell(0,0), new Cell(1,0), new Cell(1,1), new Cell(0,1)], 
    'purple'
  ),
]

const gameBoardState = ref([
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
])

// elegir pieza al azar
const selectedPiece = ref(getRandomPiece())

// Methods
function boardStateHandler() {
  //Verificar si la pieza llegó al final
  if (selectedPiece.value.parts.some((part) => part.row == 9)) {
    selectedPiece.value.parts.forEach((part) => {
      gameBoardState.value[part.row][part.column] = 1
    })
    selectedPiece.value = getRandomPiece()
    reArrangeBoard()
    return 
  }
  // Verificar si la pieza choca con otra por abajo
  const hasUnderCollision = selectedPiece.value.parts.some(
    (part) => gameBoardState.value[part.row + 1][part.column] === 1
  )
  if(hasUnderCollision) {
    selectedPiece.value.parts.forEach((part) => {
      gameBoardState.value[part.row][part.column] = 1
    })
    selectedPiece.value = getRandomPiece()
    reArrangeBoard()
    return
  }
}

function reArrangeBoard() {
  // Verificar si hay filas completas
  const completeRows = gameBoardState.value.filter((row) => row.every((cell) => cell === 1))
  if (completeRows.length > 0) {
    // Eliminar filas completas
    gameBoardState.value = gameBoardState.value.filter((row) => !row.every((cell) => cell === 1))
    // Agregar filas vacías al inicio
    for (let i = 0; i < completeRows.length; i++) {
      gameBoardState.value.unshift([0,0,0,0,0,0,0,0,0,0])
    }
  }

  // Verificar si es game over
  const isGameOver = gameBoardState.value[0].some((cell) => cell === 1)
  if (isGameOver) {
    gameBoardState.value = [
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
    ]
    alert('Game Over')
    restart()
  }
}

function blockColor(row: number, col: number): boolean {
  return selectedPiece.value.parts.some((part) => part.row == row && part.column == col)
}

function getRandomPiece() {
  const randomPiece = piezas[Math.floor(Math.random() * piezas.length)]
  return new Piece(randomPiece.name, randomPiece.center, randomPiece.parts, randomPiece.color)
}

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, ms)
  })
}

async function startGame() {
  gameBoardState.value = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
  ]
  document.addEventListener("keydown", function(event) {
    if (event.key == "ArrowLeft"){
      selectedPiece.value.move(Piece.directions.left, gameBoardState.value)
    } else if (event.key == "ArrowUp"){
      selectedPiece.value.move(Piece.directions.up, gameBoardState.value)
    } else if (event.key == "ArrowRight"){
      selectedPiece.value.move(Piece.directions.right, gameBoardState.value)
    } else if (event.key == "ArrowDown"){
      selectedPiece.value.move(Piece.directions.down, gameBoardState.value)
    }
  });
  // Loop para que la pieza baje cada 2 segundos
  setInterval(() => selectedPiece.value.move(Piece.directions.down, gameBoardState.value), 2000)
  await delay(1000)
  // Loop para verificar estado del tablero y pieza
  setInterval(() => boardStateHandler(), 2000)
}

function restart() {
  document.location.reload()
}
</script>

<template>
  <v-app>
    <v-main>
      <v-container class="contenedor" style="min-width: 1366px;">
        <v-row>
          <v-col cols="12" class="d-flex justify-center"><h1>Tetris</h1></v-col>
          <v-col cols="12" class="d-flex justify-center">
            <v-card>
              <v-card-text>
                <v-row v-for="(_, row) in 10" :key="`row-${row}`">
                  <v-col v-for="(_, col) in 10" :key="`cell-${row}-${col}`">
                    <div 
                      class="cell" 
                      :id="`${row}-${col}`" 
                      :style="[
                        blockColor(row, col) 
                          ? { backgroundColor: String(selectedPiece.color) } 
                          : gameBoardState[row][col] === 1 
                            ? { backgroundColor: '#686868' } 
                            : { backgroundColor: 'white' }
                      ]"
                    > 
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-row>
                  <v-col>
                    <v-btn block color="#686868" variant="outlined" @click="startGame()">
                      Play
                    </v-btn>
                  </v-col>
                  <v-col>
                    <v-btn block color="#686868" variant="outlined" @click="restart()">
                      Restart
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12" class="d-flex justify-center"><h3>By San Valen</h3></v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.cell {
  width: 50px;
  height: 50px;
  border: 1px solid black;
  background-color: white;
  color: black;
}
</style>
