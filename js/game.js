;(function() {
    var Game = (function() {
        var bg
          , game
          , WIDTH = 800
          , HEIGHT = 600
          , mike
          , girl
          , kid

        function unit (){
            this.x =  0
            this.y =  HEIGHT - HEIGHT / 2 + 20
            this.alive = 1
            this.w =  15
            this.h =  60
            this.up = false
            this.down = false
            this.left = false
            this.right = false
            this.speed = 5
            this.w2 = Math.floor(this.w / 2)
            this.h2 = Math.floor(this.h / 2)
        }

        var init = function() {
            var gic, gmc

            bgc = document.getElementById('background')
            gmc = document.getElementById('game')

            bgc.width = gmc.width = WIDTH
            bgc.height = gmc.height = HEIGHT

            bg = bgc.getContext('2d')
            game = gmc.getContext('2d')

            kid = new unit()
            kid.x = 400
            kid.h = 30
            kid.y = 520
            kid.following = false
            kid.steps = 0
            kid.speed = 2

            kid.walk = function() {
                if(kid.following) {
                    if((kid.x - kid.w2) > (girl.x - girl.w2)) {
                        kid.x -= girl.speed
                    } else {
                        kid.x += girl.speed
                    }
                } else {
                    kid.steps++
                    if(kid.steps < 60) {
                        kid.x += kid.speed
                    } else {
                        kid.steps = 0
                        kid.speed = -kid.speed
                    }
                }
            }

            mike = new unit()

            mike.x = 800 - mike.w - 10
            
            mike.speed = 1

            mike.chase = function() {
                var target = kid.alive ? kid : girl

                if(target.alive) {
                    if((mike.x - mike.w2) > (target.x - target.w2)) {
                        mike.x -= mike.speed
                    } else {
                        mike.x += mike.speed
                    }

                    if((mike.y + mike.h) < (target.y + target.h)) {
                        mike.y += mike.speed
                    } else {
                        mike.y -= mike.speed
                    }
                }
            }

            mike.collides = function(unit) {
                var uyh = unit.y + unit.h
                  , myh = mike.y + mike.h

                if(Math.abs(mike.x - unit.x) < (mike.w2 + unit.w2)
                   && (myh < uyh + 20)
                   && (myh > uyh - 20)) {
                    return true
                }
            }

            girl = new unit()
            girl.x = 10
            girl.getKid = function() {
                if(Math.abs(girl.x - kid.x) <= (girl.w2 + kid.w2)) {
                    kid.following = !kid.following
                }
            }

            bindKeys()
            drawBG()
            loop()
        }

        var loop = function() {
            update()
            draw()
            window.requestAnimationFrame(loop)
        }

        var drawBG = function(){
            bg.fillStyle = "rgb(244,51,110)"
            bg.fillRect (0, HEIGHT-HEIGHT/2, WIDTH, HEIGHT/2)
            bg.fillStyle = "rgb(136,175,151)"
            bg.fillRect (0, 0, WIDTH, HEIGHT-HEIGHT/2)
        }

        var bindKeys = function() {
            window.onkeydown = function(event){
                var event = event || window.event
                switch(event.keyCode){
                    case 37:
                        girl.left = true
                        break
                    case 38:
                        girl.up = true
                        break
                    case 39:
                        girl.right = true
                        break
                    case 40:
                        girl.down = true
                        break
                    case 32:
                        girl.getKid()
                        break
                }
            }

            window.onkeyup = function(event){
                var event = event || window.event
                switch(event.keyCode){
                    case 37:
                        girl.left = false
                        break
                    case 38:
                        girl.up = false
                        break
                    case 39:
                        girl.right = false
                        break
                    case 40:
                        girl.down = false
                        break
                }
            }
        }

        var update = function() {

            if(girl.alive) {
                if(girl.right && girl.x <= WIDTH - 15 - girl.w) {
                    girl.x += girl.speed
                }
                if(girl.left && girl.x >= 15) {
                    girl.x -= girl.speed
                }
                if(girl.up && girl.y >= HEIGHT - HEIGHT / 2 - 40) {
                    girl.y -= girl.speed
                }
                if(girl.down && girl.y <= HEIGHT - 75) {
                    girl.y += girl.speed
                }

                if(mike.collides(girl)) {
                    girl.alive = 0
                    var aux = girl.h
                    girl.alive = 0
                    girl.x += girl.w
                    girl.y += girl.h
                    girl.h = girl.w
                    girl.w = aux
                }
            }
            mike.chase()

            if(kid.alive) {
                kid.walk()
                if(mike.collides(kid)) {
                    var aux = kid.h
                    kid.alive = 0
                    kid.x += kid.w
                    kid.y += kid.h
                    kid.h = kid.w
                    kid.w = aux
                }

            }
        }

        var draw = function() {
            game.clearRect(0, 0, WIDTH, HEIGHT)
            
            game.fillStyle = "rgb(255,255,255)"
            game.fillRect (girl.x, girl.y, girl.w, girl.h)

            game.fillStyle = "rgb(255,255,255)"
            game.fillRect (kid.x, kid.y, kid.w, kid.h)

            game.fillStyle = "rgb(83,150,200)"
            game.fillRect (mike.x, mike.y, mike.w, mike.h)
        }

        return {
            init: init
        }

    })()
    Game.init()
})()