const handler = async (event) => {
  const { httpMethod, queryStringParameters } = event;

  if (httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  const githubApiKey = process.env.GITHUB_API_KEY;
  if (!githubApiKey) {
    return {
      statusCode: 500,
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

  const url = `https://api.github.com/repos/${owner}/${repository}/branches?per_page=100`;

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

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
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
