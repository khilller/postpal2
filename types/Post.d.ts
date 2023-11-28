interface Post {
    title: string;
    content: string;
    uid: string;
}

interface PostWithId extends Post {
    _id: string;
    createAt: string;
    platform: string;
}