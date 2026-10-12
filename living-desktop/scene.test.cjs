const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const context = vm.createContext({ Math });
vm.runInContext(fs.readFileSync(path.join(__dirname, "scene.js"), "utf8"), context);
const createScene = context.createScene;
const snapshot = scene => JSON.parse(JSON.stringify(scene.snapshot()));

test("a day of autonomous operation produces all events without accumulating visitors", () => {
    const scene = createScene(7331);
    for (let i = 0; i < 86400; i++) {
        scene.update(1);
        const state = snapshot(scene);
        assert.ok(state.activeEvents.length <= 3);
        assert.equal(new Set(state.activeEvents.map(event => event.type)).size, state.activeEvents.length);
        for (const event of state.activeEvents) assert.ok(event.age < event.duration);
    }
    const state = snapshot(scene);
    for (const type of ["drone", "repair", "meteor"]) assert.ok(state.counts[type] > 20);
    assert.equal(state.time, 86400);
});

test("seeded previews reproduce the same sequence", () => {
    const first = createScene(42);
    const second = createScene(42);
    for (let i = 0; i < 3000; i++) { first.update(0.1); second.update(0.1); }
    assert.deepEqual(snapshot(first), snapshot(second));
});

test("manual events expire and can be triggered again", () => {
    const scene = createScene(42);
    assert.equal(scene.trigger("meteor"), true);
    assert.equal(scene.trigger("meteor"), false);
    scene.update(2.5);
    assert.equal(snapshot(scene).activeEvents.length, 0);
    assert.equal(scene.trigger("meteor"), true);
    assert.equal(scene.trigger("unknown"), false);
});

test("a paused simulation holds its state", () => {
    const scene = createScene(42);
    scene.trigger("drone");
    scene.update(3);
    const before = snapshot(scene);
    for (let i = 0; i < 100; i++) scene.update(0);
    assert.deepEqual(snapshot(scene), before);
});

test("quiet activity schedules fewer visitors", () => {
    const quiet = createScene(10);
    const busy = createScene(10);
    quiet.setIntensity(0.55);
    busy.setIntensity(1.6);
    for (let i = 0; i < 3600; i++) { quiet.update(1); busy.update(1); }
    const count = scene => Object.values(snapshot(scene).counts).reduce((a, b) => a + b, 0);
    assert.ok(count(busy) > count(quiet) * 1.5);
});
