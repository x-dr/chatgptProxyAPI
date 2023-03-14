
export const config = {
    runtime: 'edge',
};

async function handler(req) {
 console.log(req.headers.get('x-forwarded-for'));

 return new Response(
    JSON.stringify({
      name: req.headers.get('x-forwarded-for'),
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    }
  )

}

export default handler;