export interface SSEMessage {
  event: string;
  data: unknown;
}

export async function* readSSE(response: Response): AsyncGenerator<SSEMessage> {
  if (!response.body) {
    throw new Error('ReadableStream is not supported by response');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const frames = buffer.split('\n\n');
    buffer = frames.pop() ?? '';

    for (const frame of frames) {
      let event = 'message';
      let dataText = '';
      for (const line of frame.split('\n')) {
        if (line.startsWith('event:')) event = line.slice(6).trim();
        else if (line.startsWith('data:')) dataText += line.slice(5).trim();
      }
      if (!dataText) continue;
      try {
        yield { event, data: JSON.parse(dataText) };
      } catch {
        console.warn('Failed to parse SSE JSON chunk:', dataText);
      }
    }
  }
}
