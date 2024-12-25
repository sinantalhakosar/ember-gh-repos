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

  const organization = new URLSearchParams(queryStringParameters).get(
    'organization',
  );

  const type = new URLSearchParams(queryStringParameters).get('type') || 'all';

  if (!organization) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Organization query parameter is missing',
      }),
    };
  }

  if (type !== 'all' && type !== 'public' && type !== 'private') {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error:
          'Type query parameter must be one of: all, public, private or missing',
      }),
    };
  }

  const url = `https://api.github.com/orgs/${organization}/repos?type=${type}`;

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
          error: `Failed to fetch repositories: ${response.statusText}`,
        }),
      };
    }

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};

module.exports = { handler };
