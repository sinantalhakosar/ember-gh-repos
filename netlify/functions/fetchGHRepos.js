function parseLinkHeader(linkHeader) {
  if (!linkHeader) return {};

  return linkHeader.split(',').reduce((acc, link) => {
    const match = link.match(/<([^>]+)>;\s*rel="([^"]+)"/);
    if (match) acc[match[2]] = match[1];
    return acc;
  }, {});
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchAllPages = async (url, githubApiKey) => {
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
        allData: [],
        remainingRateLimit: null,
        statusCode: response.status,
      };
    }

    remainingRateLimit = parseInt(
      response.headers.get('x-ratelimit-remaining'),
      10,
    );

    const data = await response.json();
    allData = allData.concat(data);

    if (remainingRateLimit <= 1) {
      return {
        allData: [],
        remainingRateLimit: 0,
        statusCode: response.status,
      };
    }

    const links = parseLinkHeader(response.headers.get('Link'));
    nextUrl = links.next;

    if (nextUrl) await delay(100);
  }

  return { allData, remainingRateLimit, statusCode: 200 };
};

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

  const organization = new URLSearchParams(queryStringParameters).get(
    'organization',
  );

  if (!organization) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Organization query parameter is missing',
      }),
    };
  }

  const url = `https://api.github.com/orgs/${organization}/repos?per_page=100`;

  try {
    const {
      allData: data,
      remainingRateLimit,
      statusCode,
    } = await fetchAllPages(url, githubApiKey);

    if (statusCode === 401) {
      return {
        statusCode,
        body: JSON.stringify({
          error: 'Failed to fetch repositories',
        }),
      };
    }

    if (
      (remainingRateLimit !== null && remainingRateLimit <= 1) ||
      statusCode === 429
    ) {
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
