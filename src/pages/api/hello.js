// /api/hello
async function handler(req) {
  return new Response(
    JSON.stringify({
      name: 'Hello word！',
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    }
  )
}

export const config = {
  runtime: 'edge',
};

export default handler;
