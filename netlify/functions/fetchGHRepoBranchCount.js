const handler = async (event) => {
  const { httpMethod, queryStringParameters, headers } = event;

  if (httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }
  const githubToken = headers.cookie
    .split(';')
    .find((cookie) => cookie.trim().startsWith('github_token='))
    ?.split('=')[1];

  const githubApiKey = process.env.GITHUB_API_KEY || githubToken;
  if (!githubApiKey) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'GitHub API key is missing' }),
    };
  }

  const owner = new URLSearchParams(queryStringParameters).get('owner');

  const repository = new URLSearchParams(queryStringParameters).get(
    'repository',
  );

  if (!owner || !repository) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Required query parameters are missing',
      }),
    };
  }

  const url = `https://api.github.com/repos/${owner}/${repository}/branches?per_page=1`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${githubApiKey}`,
        Accept: 'application/vnd.github+json',
      },
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: `Failed to fetch branches: ${response.statusText}`,
        }),
      };
    }

    const remainingRateLimit = parseInt(
      response.headers.get('x-ratelimit-remaining'),
      10,
    );

    if (remainingRateLimit <= 1) {
      return {
        statusCode: 429,
        body: JSON.stringify({ data: undefined }),
      };
    }

    const data = await response.json();
    if (data.length === 0) {
      // means repo is empty
      return {
        statusCode: 200,
        body: JSON.stringify({ data: 0 }),
      };
    }

    const linkHeader = response.headers.get('link');
    let branchCount = 1; // main branch is always there

    if (linkHeader) {
      const matches = linkHeader.match(/page=(\d+)>; rel="last"/);
      if (matches && matches[1]) {
        branchCount = parseInt(matches[1], 10);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ data: branchCount }),
    };
  } catch (error) {
    console.error('Error fetching branches:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};

module.exports = { handler };
