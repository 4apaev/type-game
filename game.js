(exp => {

  let game;

  class Game {
    constructor() {
      this.cx = document.querySelector("canvas").getContext("2d")
      this.cx.font='1em monaco'
      this.cx.fillStyle = "cornflowerblue"

      this.width=this.cx.canvas.width
      this.height=this.cx.canvas.height
      this.az = Array(4)
      this.score = 0
      this.lives = 5
      for(let i = this.az.length; i--;)
        this.az[ i ] = this.spawn(i)
      document.onkeyup = (e) => this.guess(String.fromCharCode(e.keyCode).toLowerCase())
    }

    guess(value) {
      for(let i = this.az.length; i--;) {
        if (this.az[ i ].value===value) {
          this.az[ i ] = this.spawn(i)
          this.score+=50
          this.blink('yellowgreen')
          return this.start()
        }
      }
    }

    start() {
      this.clear()
      if (this.lives > 0 && this.az.length) {
        this.tid = setTimeout(() => this.start(), 100)
        this.update()
      } else {
        this.az.length = 0
        document.onkeyup = null
        this.draw({ value: `Game Over!`, x: 20, y: 50 })
        over()
      }
    }

    update() {
      for (let i = 0; i < this.az.length; i++) {
        let entry = this.az[ i ]
        if (entry.y < this.height) {
          entry.y +=10
          this.draw(entry)
        } else {
          this.az[ i ] = this.spawn(i)
          this.lives--
          this.blink('tomato')
        }
      }
    }

    draw({ value, x, y }) {
        this.cx.fillText(`Score: ${ this.score }, Lives: ${ this.lives }`, 20, 20)
        this.cx.fillText(value, x, y)
      }

    clear() {
        clearTimeout(this.tid)
        this.cx.clearRect(0,0, this.width, this.height)
      }

    spawn(i) {
        let value = 'abcdefghijklmnopqrstuvwxyz'.charAt(0|Math.random()*26)
        let y = -(0|Math.random()*this.height)
        let x = i*(0|this.width/this.az.length)
        return { x, y, value }
      }

    blink(color) {
      this.cx.canvas.style.background = color
      setTimeout(() => this.cx.canvas.removeAttribute('style'), 100)
    }
  }

  function init() {
      start()
      document.body.addEventListener('click', e => {
        let { id } = e.target
        if (id==='save' && game) {
          let name = document.querySelector('input[name=name]').value
          save(name, game.score)
        } else if (id==='start') {
          render()
          game = new Game
          game.start()
        }
      })
    }

  function render(html='') {
      document.querySelector('main').innerHTML = html
    }

  function start() {
      render(`<button id=start>start</button>`)
    }
  function over() {
      render(`<input type=text name=name placeholder="insert name"><button id=save>save</button><button id=start>start</button>`)
    }

  function  showScore({ result=[] }) {
      render(`<h2>High Score</h2><ul>${ result.map(user => `<li><b>${ user.name }</b>:<i>${ user.score }</i></li>`).join('') }</ul><button id=start>start</button>`)
    }

  function  showErr() {
      render(`<h2>Error</h2>`)
    }


  function save(name, score) {
    fetch('/score', {
      method: 'POST',
      body: JSON.stringify({ name, score }),
      headers: { 'Content-Type': 'application/json' }
    })
        .then(x => x.json())
        .then(showScore)
        .catch(showErr)
  }

  exp.app = { Game, init }

})(this)