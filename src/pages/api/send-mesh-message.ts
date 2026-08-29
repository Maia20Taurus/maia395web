export const prerender = false

export default {
  async fetch(request: Request, env: Env) {
    if (request.method === "POST") {
      const stub = env.MY_DURABLE_OBJECT.getByName("foo");
      return stub.replicateMessage(request.body);
    }

    return new Response("Wrong request method. Only POST is accepted.", {status: 400});    
  }
}