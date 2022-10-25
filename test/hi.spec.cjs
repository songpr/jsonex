const t = require('tap');
t.test('Hello World with commonjs', async tap => {
    const { default: jsonex } = await import('../index.js');
    const hiJsonexp = jsonex.compile({ value: "Hello World" });
    tap.equal(hiJsonexp.exec({}), "Hello World", "Hello World pass")
    tap.equal(hiJsonexp.exec({ name: "Song" }), "Hello World", "Hello World pass")
})
