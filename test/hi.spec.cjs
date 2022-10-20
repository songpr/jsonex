const t = require('tap');
t.test('Hello World with commonjs', async tap => {
    const { jsonex } = await import('../index.js');
    console.log(jsonex)
    const hiJsonexp = new jsonex({ type: "string", value: "Hello World" });
    tap.equal(hiJsonexp.execute({}), "Hello World", "Hello World pass")
    tap.equal(hiJsonexp.execute({ name: "Song" }), "Hello World", "Hello World pass")
})
