export async function getPosts() {
  const res = await fetch("/api/getPosts",{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-cache',
  });

  if (!res.ok) {
    throw new Error(`Failed to get posts: ${res.statusText}`);
  }

  const data = await res.json();
  return data.posts;

}