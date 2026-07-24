export default {
  async fetch(request, env) {
    const stub = env.MY_DURABLE_OBJECT.getByName("foo");
    return stub.fetch(request);
  }
}