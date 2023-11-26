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

export async function deletPost(_id: string) {
  const res = await fetch("/api/deletePost/",{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-cache',
    body: JSON.stringify({ _id }),
  });

  if (!res.ok) {
    throw new Error(`Failed to delete post: ${res.statusText}`);
  }

  const data = await res.json();
  return data;

}

export async function getProfile() {
    const res  = await fetch("/api/getProfile",{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-cache',
        });
    const data = await res.json();
    return data.profile;
}