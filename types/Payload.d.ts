interface Payload {
    model: string,
    message: string[],
    temperature: number,
    top_p: number,
    stream: true,
    n: 1,
}