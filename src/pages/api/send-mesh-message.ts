export default {
  async fetch(request: Request, env: Env) {
    const stub = env.MY_DURABLE_OBJECT.getByName("foo");
    return stub.fetch(request);
  }
}