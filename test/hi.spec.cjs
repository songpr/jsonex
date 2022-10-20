const t = require('tap');
t.test('Hello World with commonjs', async tap => {
    const { jsonex } = await import('../index.js');
    const hiJsonexp = jsonex.compile({ type: "string", value: "Hello World" });
    tap.equal(hiJsonexp.exec({}), "Hello World", "Hello World pass")
    tap.equal(hiJsonexp.exec({ name: "Song" }), "Hello World", "Hello World pass")
})
