// Shared by the browser preview and Qt Quick's Canvas. Coordinates follow the
// 1280 × 720 gallery reference; the underlying wallpaper stays native 4K.
function createScene(seed) {
    var randomState = seed === undefined ? 7331 : seed >>> 0;
    function random() {
        randomState = (Math.imul(randomState, 1664525) + 1013904223) >>> 0;
        return randomState / 4294967296;
    }
    function between(a, b) { return a + (b - a) * random(); }
    function smooth(t) { return t * t * (3 - 2 * t); }
    function pixel(ctx, x, y, w, h, color) {
        ctx.fillStyle = color;
        ctx.fillRect(Math.round(x), Math.round(y), w, h);
    }
    function glow(ctx, x, y, radius, color, alpha) {
        var gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, "rgba(" + color + "," + alpha + ")");
        gradient.addColorStop(1, "rgba(" + color + ",0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    }
    var time = 0;
    var lowerTime = 18;
    var intensity = 1;
    var events = [];
    var nextEventAt = between(16, 28);
    var eventCounts = { drone: 0, repair: 0, meteor: 0 };
    var lastEvent = "La ronda comincia";
    var fireflies = [];
    var stars = [];
    var mist = [];
    var ripples = [];
    var windowLights = [
        [91, 6, 5], [149, 54, 3], [85, 122, 4], [24, 205, 4],
        [86, 258, 3], [150, 300, 3], [241, 232, 5], [289, 344, 4],
        [86, 412, 4], [174, 516, 4], [312, 662, 5], [1193, 246, 2]
    ];
    for (var i = 0; i < 32; i++) {
        fireflies.push({ x: between(332, 1100), y: between(460, 710),
            phase: between(0, Math.PI * 2), speed: between(0.18, 0.45),
            radius: between(7, 26), size: i < 10 ? 2 : 1 });
    }
    for (var j = 0; j < 24; j++) {
        stars.push({ x: between(425, 1100), y: between(12, 158),
            phase: between(0, 8), period: between(3, 8) });
    }
    for (var k = 0; k < 18; k++) {
        mist.push({ x: between(390, 1090), y: between(418, 548),
            width: between(40, 120), phase: between(0, 9) });
    }
    // Short broken highlights stay on the river, rather than moving the land.
    var river = [[645, 530, 30], [704, 548, 48], [767, 556, 42],
        [879, 592, 55], [940, 611, 35], [866, 637, 38], [881, 654, 29]];
    for (var r = 0; r < 56; r++) {
        var reach = river[r % river.length];
        ripples.push({ x: reach[0] + between(-reach[2], reach[2]),
            y: reach[1] + between(-6, 6), length: between(2, 10),
            phase: between(0, 9), speed: between(0.4, 1.2) });
    }

    function trigger(type) {
        // A single visitor of each kind keeps a manually triggered preview calm.
        for (var i = 0; i < events.length; i++) {
            if (events[i].type === type) return false;
        }
        var event = { type: type, started: time, phase: between(0, 6) };
        if (type === "drone") {
            event.duration = between(34, 48);
            event.direction = random() < 0.5 ? 1 : -1;
            event.height = between(210, 316);
            lastEvent = "Un corriere attraversa la valle";
        } else if (type === "repair") {
            event.duration = between(7, 12);
            lastEvent = "Manutenzione sulla passerella";
        } else if (type === "meteor") {
            event.duration = 2.4;
            event.x = between(580, 880);
            event.y = between(35, 88);
            lastEvent = "Una scia nel cielo";
        } else return false;
        eventCounts[type]++;
        events.push(event);
        return true;
    }

    function update(dt) {
        time += dt;
        if (!events.some(function (event) { return event.type === "repair"; })) lowerTime += dt;
        events = events.filter(function (event) {
            return time - event.started < event.duration;
        });
        if (time >= nextEventAt) {
            var choice = random();
            trigger(choice < 0.48 ? "drone" : choice < 0.83 ? "repair" : "meteor");
            nextEventAt = time + between(25, 65) / intensity;
        }
    }

    function drawRobot(ctx, x, ground, direction, walking, phase, scale) {
        ctx.save();
        ctx.translate(Math.round(x), Math.round(ground));
        ctx.scale(direction * scale, scale);
        var stride = walking ? Math.round(Math.sin(phase * 7) * 3) : 0;
        var bob = walking ? Math.round(Math.abs(Math.sin(phase * 7))) : 0;
        // Little articulated legs, worn body, offset monocular head.
        pixel(ctx, -7 + stride, -7, 4, 6, "#596065");
        pixel(ctx, 3 - stride, -7, 4, 6, "#4b5050");
        pixel(ctx, -9 + stride, -2, 7, 2, "#92836c");
        pixel(ctx, 2 - stride, -2, 7, 2, "#a18a67");
        pixel(ctx, -5, -17 - bob, 11, 10, "#262d2d");
        pixel(ctx, -5, -17 - bob, 9, 3, "#9f845c");
        pixel(ctx, -4, -13 - bob, 8, 5, "#5d5744");
        pixel(ctx, -3, -10 - bob, 2, 2, "#b18e5c");
        pixel(ctx, 5, -15 - bob, 3, 7, "#756b53");
        pixel(ctx, -4, -23 - bob, 3, 6, "#5f6054");
        pixel(ctx, -9, -31 - bob, 17, 10, "#172a2b");
        pixel(ctx, -8, -32 - bob, 15, 2, "#b29a71");
        pixel(ctx, -8, -29 - bob, 11, 6, "#786446");
        pixel(ctx, -6, -28 - bob, 1, 5, "#b09868");
        pixel(ctx, -3, -28 - bob, 1, 5, "#4e493a");
        pixel(ctx, 4, -30 - bob, 5, 7, "#d3ae78");
        pixel(ctx, 6, -28 - bob, 2, 3, "#ffedbb");
        glow(ctx, 7, -27 - bob, 10, "235,181,92", 0.24);
        ctx.restore();
    }

    function render(ctx, width, height, foregroundImage) {
        var cover = Math.max(width / 1280, height / 720);
        ctx.save();
        ctx.translate((width - 1280 * cover) / 2, (height - 720 * cover) / 2);
        ctx.scale(cover, cover);
        var i;
        for (i = 0; i < stars.length; i++) {
            var star = stars[i];
            var alpha = 0.06 + 0.32 * Math.pow((1 + Math.sin(time / star.period + star.phase)) / 2, 4);
            pixel(ctx, star.x, star.y, 1, 1, "rgba(206,229,226," + alpha + ")");
        }
        for (i = 0; i < mist.length; i++) {
            var puff = mist[i];
            var mx = puff.x + Math.sin(time * 0.025 + puff.phase) * 35;
            for (var strip = 0; strip < 4; strip++) {
                var spread = puff.width * (1 - strip * 0.14);
                pixel(ctx, mx - spread / 2, puff.y + strip * 3,
                    spread, 3, "rgba(113,151,166," + (0.018 * intensity) + ")");
            }
        }
        for (i = 0; i < ripples.length; i++) {
            var ripple = ripples[i];
            var shimmer = Math.pow((1 + Math.sin(time * ripple.speed + ripple.phase)) / 2, 3);
            pixel(ctx, ripple.x + Math.sin(time * 0.3 + ripple.phase) * 3,
                ripple.y, Math.round(ripple.length), 1,
                "rgba(141,179,187," + (shimmer * 0.15 * intensity) + ")");
        }
        for (i = 0; i < windowLights.length; i++) {
            var lamp = windowLights[i];
            var warmth = 0.09 + 0.045 * Math.sin(time * 0.7 + i * 3) + 0.015 * Math.sin(time * 2.1 + i);
            glow(ctx, lamp[0], lamp[1], lamp[2] * 4, "232,169,78", warmth);
        }
        // The original lookout robot remains at its post, with a living lens.
        glow(ctx, 364, 337, 17, "241,177,76", 0.15 + 0.05 * Math.sin(time * 0.75));

        // Patrol: walk out, inspect a pipe, return, and wait in the doorway.
        var cycle = time % 61;
        var patrolX, facing, walking;
        if (cycle < 21) {
            patrolX = 224 + smooth(cycle / 21) * 83; facing = 1; walking = true;
        } else if (cycle < 33) {
            patrolX = 307; facing = 1; walking = false;
        } else if (cycle < 55) {
            patrolX = 307 - smooth((cycle - 33) / 22) * 83; facing = -1; walking = true;
        } else {
            patrolX = 224; facing = -1; walking = false;
        }
        drawRobot(ctx, patrolX, 377, facing, walking, time, 0.85);
        // A smaller service robot uses the lower walkway.
        var lowerCycle = lowerTime % 77;
        var lowerX = 151 + (1 - Math.cos(Math.min(lowerCycle / 65, 1) * Math.PI * 2)) * 41;
        var repairing = events.some(function (event) { return event.type === "repair"; });
        drawRobot(ctx, lowerX, 581, repairing || lowerCycle < 32.5 ? 1 : -1,
            !repairing && lowerCycle < 65, time + 4, 0.64);

        // Reapply only the original front rails, so walkers have real occlusion.
        if (foregroundImage) {
            ctx.drawImage(foregroundImage, 210 * 3, 363 * 3, 112 * 3, 5 * 3, 210, 363, 112, 5);
            ctx.drawImage(foregroundImage, 133 * 3, 565 * 3, 111 * 3, 5 * 3, 133, 565, 111, 5);
        }
        for (i = 0; i < events.length; i++) {
            var event = events[i];
            var age = time - event.started;
            if (event.type === "drone") {
                var progress = age / event.duration;
                var dx = event.direction === 1 ? 390 + progress * 960 : 1350 - progress * 960;
                var dy = event.height + Math.sin(age * 0.65 + event.phase) * 5;
                ctx.save();
                ctx.translate(Math.round(dx), Math.round(dy));
                ctx.scale(event.direction, 1);
                // Bronze courier with a suspended cargo crate and cyan thrusters.
                pixel(ctx, -15, 0, 27, 7, "#101d24");
                pixel(ctx, -11, -3, 21, 4, "#b89b6d");
                pixel(ctx, -12, 1, 21, 3, "#645b48");
                pixel(ctx, -17, -1, 6, 3, "#354c51");
                pixel(ctx, 9, -1, 6, 3, "#506367");
                pixel(ctx, -9, 7, 2, 7, "#66706a");
                pixel(ctx, 5, 7, 2, 7, "#66706a");
                pixel(ctx, -9, 14, 16, 9, "#766047");
                pixel(ctx, -8, 14, 14, 2, "#b79865");
                pixel(ctx, -5, 17, 2, 5, "#b79865");
                pixel(ctx, -16, 6, 3, 2, "#b2d6cf");
                pixel(ctx, 10, 6, 3, 2, "#b2d6cf");
                glow(ctx, -15, 8, 12, "121,201,194", 0.15 + 0.07 * Math.sin(age * 8));
                glow(ctx, 11, 8, 12, "121,201,194", 0.15);
                pixel(ctx, 7, 1, 2, 2, "#f3d99e");
                ctx.restore();
            } else if (event.type === "repair") {
                // Intermittent sparks beside the lower worker's actual position.
                var burst = Math.floor(age * 6);
                if (burst % 7 < 3) {
                    glow(ctx, lowerX + 9, 571, 16, "240,174,85", 0.18);
                    for (var spark = 0; spark < 8; spark++) {
                        var flight = ((age * 2 + spark * 0.127) % 1);
                        pixel(ctx, lowerX + 8 + flight * (7 + spark * 2),
                            573 - Math.sin(flight * Math.PI) * (5 + spark) + flight * 6,
                            1, 1, flight < 0.6 ? "#eed6a0" : "#ac7d48");
                    }
                }
            } else if (event.type === "meteor") {
                var head = Math.min(age / 0.9, 1);
                var opacity = Math.max(0, 1 - Math.max(age - 0.55, 0) / 1.5);
                for (var tail = 0; tail < 24; tail++) {
                    var fraction = Math.max(head - tail * 0.013, 0);
                    pixel(ctx, event.x + fraction * 154, event.y + fraction * 48,
                        tail < 2 ? 2 : 1, 1,
                        "rgba(211,221,203," + (opacity * (1 - tail / 24) * 0.65) + ")");
                }
            }
        }
        // The distant station sends three tiny amber pulses every 19 seconds.
        var beaconPhase = time % 19;
        if (beaconPhase < 2.8 && Math.floor(beaconPhase * 3) % 2 === 0) {
            glow(ctx, 1190, 154, 7, "222,167,92", 0.2);
            pixel(ctx, 1189, 152, 2, 2, "#d4ae78");
        }
        for (i = 0; i < fireflies.length; i++) {
            var fly = fireflies[i];
            var fx = fly.x + Math.sin(time * fly.speed + fly.phase) * fly.radius;
            var fy = fly.y + Math.cos(time * fly.speed * 0.73 + fly.phase) * fly.radius * 0.43;
            var brightness = Math.min(0.9,
                Math.pow((1 + Math.sin(time * 0.9 + fly.phase * 3)) / 2, 5) * 0.7 * intensity);
            if (brightness > 0.04) {
                glow(ctx, fx, fy, 6, "200,198,122", brightness * 0.18);
                pixel(ctx, fx, fy, fly.size, 1, "rgba(223,215,149," + brightness + ")");
            }
        }
        ctx.restore();
    }

    return {
        update: update,
        render: render,
        trigger: trigger,
        setIntensity: function (value) { intensity = value; },
        snapshot: function () {
            return { time: time, activeEvents: events.map(function (event) {
                return { type: event.type, age: time - event.started, duration: event.duration };
            }), nextEventAt: nextEventAt,
            counts: { drone: eventCounts.drone, repair: eventCounts.repair, meteor: eventCounts.meteor },
            lastEvent: lastEvent, intensity: intensity };
        }
    };
}
