function parseLinkHeader(linkHeader) {
  if (!linkHeader) return {};

  return linkHeader.split(',').reduce((acc, link) => {
    const match = link.match(/<([^>]+)>;\s*rel="([^"]+)"/);
    if (match) acc[match[2]] = match[1];
    return acc;
  }, {});
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchAllPages = async (url) => {
  const githubApiKey = process.env.GITHUB_API_KEY;
  if (!githubApiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'GitHub API key is missing' }),
    };
  }

  let allData = [];
  let nextUrl = url;
  let remainingRateLimit = 5000;

  while (nextUrl) {
    const response = await fetch(nextUrl, {
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

    remainingRateLimit = parseInt(
      response.headers.get('x-ratelimit-remaining'),
      10,
    );

    const data = await response.json();
    allData = allData.concat(data);

    if (remainingRateLimit <= 1) {
      break;
    }

    const links = parseLinkHeader(response.headers.get('Link'));
    nextUrl = links.next;

    if (nextUrl) await delay(100);
  }

  return { allData, remainingRateLimit };
};

const handler = async (event) => {
  const { httpMethod, queryStringParameters } = event;

  if (httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
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

  const url = `https://api.github.com/orgs/${organization}/repos?type=${type}&per_page=100`;

  try {
    const { allData: data, remainingRateLimit } = await fetchAllPages(url);

    if (remainingRateLimit <= 1) {
      return {
        statusCode: 429,
        body: JSON.stringify({
          error: 'Rate limit exceeded',
        }),
      };
    }

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
