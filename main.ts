namespace SpriteKind {
    export const PowerUp = SpriteKind.create()
    export const RadialPowerUp = SpriteKind.create()
    export const en = SpriteKind.create()
}
// --- 9. GLOBAL RESOLUTION INTERSECTION CODES ---
// NEW: Collect Weapon Upgrade (Lasts for 5000 milliseconds)
sprites.onOverlap(SpriteKind.Player, SpriteKind.RadialPowerUp, function (sprite, otherSprite) {
    otherSprite.destroy()
    hasRadialBurst = true
    setTimeout(function () {
        hasRadialBurst = false
    }, 5000)
})
// Projectile hits either type of enemy
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (projectile, enemy) {
    projectile.destroy()
    enemy.destroy()
    info.changeScoreBy(1)
})
// --- 4. ATTACK TRIGGER (CONDITIONAL WEAPON SYSTEM) ---
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (hasRadialBurst) {
        // --- POWER-UP ACTIVE: 8-WAY RADIAL SHOCKWAVE BURST ---
        // Diagonal Down-Left
        directions = [
        { vx: 150, vy: 0 },
        // Right
            { vx: -150, vy: 0 },
        // Left
            { vx: 0, vy: -150 },
        // Up
            { vx: 0, vy: 150 },
        // Down
            { vx: 110, vy: -110 },
        // Diagonal Up-Right
            { vx: -110, vy: -110 },
        // Diagonal Up-Left
            { vx: 110, vy: 110 },
        // Diagonal Down-Right
            { vx: -110, vy: 110 }
        ]
        for (let dir of directions) {
            shockwave = sprites.createProjectileFromSprite(img`
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . 9 9 . . . . . . . 
                . . . . . . 9 9 9 9 . . . . . . 
                . . . . . 9 9 1 1 9 9 . . . . . 
                . . . . 9 9 1 1 1 1 9 9 . . . . 
                . . . . 9 1 1 1 1 1 1 9 . . . . 
                . . . . 9 1 1 1 1 1 1 9 . . . . 
                . . . . 9 9 1 1 1 1 9 9 . . . . 
                . . . . . 9 9 1 1 9 9 . . . . . 
                . . . . . . 9 9 9 9 . . . . . . 
                . . . . . . . 9 9 . . . . . . . 
                . . . . . . . . . . . . . . . . 
                `, playerShrimp, 50, 50)
        }
    } else {
        // --- BASE STATE: SNAPPY SINGLE DIRECTIONAL SHOCKWAVE ---
        shockwave = sprites.createProjectileFromSprite(img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . 9 9 . . . . . . . 
            . . . . . . 9 9 9 9 . . . . . . 
            . . . . . 9 9 1 1 9 9 . . . . . 
            . . . . 9 9 1 1 1 1 9 9 . . . . 
            . . . . 9 1 1 1 1 1 1 9 . . . . 
            . . . . 9 1 1 1 1 1 1 9 . . . . 
            . . . . 9 9 1 1 1 1 9 9 . . . . 
            . . . . . 9 9 1 1 9 9 . . . . . 
            . . . . . . 9 9 9 9 . . . . . . 
            . . . . . . . 9 9 . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, playerShrimp, 0, 0)
        if (controller.left.isPressed()) {
            shockwave.vx = -150
            shockwave.vy = 0
        } else if (controller.up.isPressed()) {
            shockwave.vx = 0
            shockwave.vy = -150
        } else if (controller.down.isPressed()) {
            shockwave.vx = 0
            shockwave.vy = 150
        } else {
            shockwave.vx = 150
            shockwave.vy = 0
        }
    }
})
// Player hits objects
sprites.onOverlap(SpriteKind.Player, SpriteKind.PowerUp, function (sprite, otherSprite) {
    info.changeLifeBy(1)
    otherSprite.destroy()
})
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.en, function (projectile, enemy) {
    projectile.destroy()
    enemy.destroy()
    info.changeScoreBy(1)
})
// Shark Boss hits Player (-2 Lives)
sprites.onOverlap(SpriteKind.Player, SpriteKind.en, function (player2, enemy) {
    enemy.destroy()
    info.changeLifeBy(-2)
})
// Regular Jelly hits Player (-1 Life)
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (player2, enemy) {
    enemy.destroy()
    info.changeLifeBy(-1)
})
let enemyJelly: Sprite = null
let weaponUpgrade: Sprite = null
let x: Sprite = null
let shark: Sprite = null
let shockwave: Sprite = null
let directions: number[] = []
let playerShrimp: Sprite = null
// Core State Tracker: Controls whether you have the 8-way burst active
let hasRadialBurst = false
// --- 1. LEVEL & GAME CONFIGURATION ---
tiles.setCurrentTilemap(tilemap`level1`)
scene.setBackgroundColor(9)
info.setLife(3)
// --- 2. HERO CHARACTER INITIALIZATION ---
playerShrimp = sprites.create(img`
    . . . . . . . . . . . . . . . . 
    . . . . . . f f f f . . . . . . 
    . . . . f f 5 5 5 5 f f . . . . 
    . . . f 5 5 5 5 5 5 5 5 f . . . 
    . . f 5 5 5 f f f f 5 5 5 f . . 
    . . f 5 5 f d d d d f 5 5 f . . 
    . f 5 5 f d f d d f d f 5 5 f . 
    . f 5 5 f d d d d d d f 5 5 f . 
    . f 5 5 5 f f f f f f 5 5 5 f . 
    . . f 5 5 5 5 5 5 5 5 5 5 f . . 
    . . . f f f f f f f f f f . . . 
    . . . . f e e e e e e f . . . . 
    . . . . f e f e e f e f . . . . 
    . . . . f e e e e e e f . . . . 
    . . . . . f f f f f f . . . . . 
    . . . . . . . . . . . . . . . . 
    `, SpriteKind.Player)
tiles.placeOnRandomTile(playerShrimp, assets.tile`baseTransparency17`)
// --- 3. FREE 4-WAY MOVEMENT PHYSICS ---
controller.moveSprite(playerShrimp, 100, 100)
scene.cameraFollowSprite(playerShrimp)
// --- 5. AUTOMATED SHARK SPAWNER (RELATIVE CAMERA POSITION) ---
game.onUpdateInterval(5000, function () {
    shark = sprites.create(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . c c c . . . . 
        . . . . . . . . c 8 8 8 c . . . 
        . . . c c c c c 8 8 f 8 8 c . . 
        . . c 8 8 8 8 8 8 8 8 8 8 c . . 
        . c 8 8 8 8 8 8 8 8 8 8 8 8 c . 
        c 8 8 8 8 8 1 1 1 1 8 8 8 c . . 
        c 8 8 8 8 8 8 8 8 8 8 8 c . . . 
        . c c c c c c 8 8 8 c c . . . . 
        . . . . . . c 8 8 c . . . . . . 
        . . . . . c 8 8 c . . . . . . . 
        . . . . . c c c . . . . . . . . 
        `, SpriteKind.en)
    shark.x = scene.cameraLeft()
    shark.y = randint(scene.cameraTop() + 20, scene.cameraTop() + scene.screenHeight() - 20)
    shark.vx = 80
    shark.vy = 0
    shark.setFlag(SpriteFlag.AutoDestroy, true)
})
// --- 6. AUTOMATED POWERUP LIFE BUBBLE SPAWNER ---
game.onUpdateInterval(2001, function () {
    x = sprites.create(img`
        . . . . . b b b b b b . . . . . 
        . . . b b 9 9 9 9 9 9 b b . . . 
        . . b b 9 9 9 9 9 9 9 9 b b . . 
        . b b 9 d 9 9 9 9 9 9 9 9 b b . 
        . b 9 d 9 9 9 9 9 1 1 1 9 9 b . 
        b 9 d 9 9 9 9 9 9 1 1 1 9 9 9 b 
        b 9 d 9 9 9 9 9 9 1 1 1 9 9 9 b 
        b 9 3 9 9 9 9 9 9 9 9 9 1 9 9 b 
        b 5 3 d 9 9 9 9 9 9 9 9 9 9 9 b 
        b 5 3 3 9 9 9 9 9 9 9 9 9 d 9 b 
        b 5 d 3 3 9 9 9 9 9 9 9 d d 9 b 
        . b 5 3 3 3 d 9 9 9 9 d d 5 b . 
        . b d 5 3 3 3 3 3 3 3 d 5 b b . 
        . . b d 5 d 3 3 3 3 5 5 b b . . 
        . . . b b 5 5 5 5 5 5 b b . . . 
        . . . . . b b b b b b . . . . . 
        `, SpriteKind.PowerUp)
    tiles.placeOnRandomTile(x, assets.tile`baseTransparency17`)
})
// --- 7. NEW: TEMPORARY WEAPON UPGRADE SPAWNER ---
// Spawns a unique orange star item every 7 seconds
game.onUpdateInterval(7000, function () {
    weaponUpgrade = sprites.create(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . 5 . . . . . . . . 
        . . . . . . 5 5 5 . . . . . . . 
        . . . . . 5 5 5 5 5 . . . . . . 
        . . . 5 5 5 5 5 5 5 5 5 . . . . 
        . . . . 5 5 5 5 5 5 5 . . . . . 
        . . . . . 5 5 5 5 5 . . . . . . 
        . . . . 5 5 5 5 5 5 5 . . . . . 
        . . . 5 5 5 . . . 5 5 5 . . . . 
        . . . 5 . . . . . . . 5 . . . . 
        . . . . . . . . . . . . . . . . 
        `, SpriteKind.RadialPowerUp)
    tiles.placeOnRandomTile(weaponUpgrade, assets.tile`oceanSand6`)
})
// --- 8. AUTOMATED JELLY ENEMY SPAWNER ---
game.onUpdateInterval(2000, function () {
    enemyJelly = sprites.create(img`
        . . . . . . . . . . . . . . . . 
        . . . . . a a a a a a . . . . . 
        . . . . a a 2 2 2 2 a a . . . . 
        . . . a a 2 2 2 2 2 2 a a . . . 
        . . . a 2 2 f 2 2 f 2 2 a . . . 
        . . . a 2 2 2 2 2 2 2 2 a . . . 
        . . . a a 2 2 2 2 2 2 a a . . . 
        . . . . a a a a a a a a . . . . 
        . . . . . 2 . 2 . 2 . 2 . . . . 
        . . . . . 2 . 2 . 2 . 2 . . . . 
        . . . . 2 . 2 . 2 . 2 . . . . . 
        . . . . 2 . 2 . 2 . 2 . . . . . 
        . . . . . . . . . . . . . . . . 
        `, SpriteKind.Enemy)
    enemyJelly.x = randint(scene.cameraLeft() + 20, scene.cameraLeft() + scene.screenWidth() - 20)
    enemyJelly.y = randint(scene.cameraTop() + 20, scene.cameraTop() + scene.screenHeight() - 20)
    enemyJelly.follow(playerShrimp, 30)
})
