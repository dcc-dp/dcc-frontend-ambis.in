'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

export interface ToolCallEvent {
  tool_name: string;
  arguments?: Record<string, unknown>;
  status?: string;
  output?: Record<string, unknown>;
}

export interface HermesContextWindow {
  session_id?: string;
  learning_path_id?: number;
  current_topic?: string;
  active_tasks?: Record<string, unknown>[];
  recent_attempts?: Record<string, unknown>[];
  scaffold_level?: number;
}

export interface UseHermesAgentOptions {
  apiBaseUrl?: string;
  defaultScaffoldLevel?: number;
}

export interface UseHermesAgentReturn {
  isThinking: boolean;
  thoughts: string[];
  content: string;
  toolCalls: ToolCallEvent[];
  scaffoldLevel: number;
  isStreaming: boolean;
  error: string | null;
  sendPrompt: (
    prompt: string,
    mode?: 'learning_path' | 'ask' | 'productivity_task',
    context?: Partial<HermesContextWindow>
  ) => Promise<void>;
  abortStream: () => void;
  reset: () => void;
}

export function useHermesAgent(options?: UseHermesAgentOptions): UseHermesAgentReturn {
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [thoughts, setThoughts] = useState<string[]>([]);
  const [content, setContent] = useState<string>('');
  const [toolCalls, setToolCalls] = useState<ToolCallEvent[]>([]);
  const [scaffoldLevel, setScaffoldLevel] = useState<number>(options?.defaultScaffoldLevel || 1);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const abortStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    setIsThinking(false);
  }, []);

  const reset = useCallback(() => {
    abortStream();
    setIsThinking(false);
    setThoughts([]);
    setContent('');
    setToolCalls([]);
    setError(null);
  }, [abortStream]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const sendPrompt = useCallback(
    async (
      prompt: string,
      mode: 'learning_path' | 'ask' | 'productivity_task' = 'ask',
      context?: Partial<HermesContextWindow>
    ) => {
      // Abort any ongoing stream
      abortStream();

      // Reset state for new prompt
      setError(null);
      setIsStreaming(true);
      setIsThinking(true);
      setThoughts([]);
      setContent('');
      setToolCalls([]);

      const activeScaffold = context?.scaffold_level || scaffoldLevel;
      setScaffoldLevel(activeScaffold);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const baseUrl =
        options?.apiBaseUrl ||
        process.env.NEXT_PUBLIC_API_URL ||
        'http://localhost:8001';
      const endpoint = `${baseUrl}/api/v1/agent/hermes`;

      const requestPayload = {
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        prompt: prompt.trim(),
        mode,
        context_window: {
          scaffold_level: activeScaffold,
          current_topic: context?.current_topic || 'Matematika & Pemecahan Masalah',
          ...context,
        },
        stream: true,
      };

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'text/event-stream',
          },
          body: JSON.stringify(requestPayload),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
        }

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

          // SSE blocks are delimited by two newlines
          const messages = buffer.split('\n\n');
          // Keep whatever is after the last delimiter in the buffer
          buffer = messages.pop() || '';

          for (const rawMessage of messages) {
            if (!rawMessage.trim()) continue;

            const lines = rawMessage.split('\n');
            let eventType = 'message';
            let dataStr = '';

            for (const line of lines) {
              if (line.startsWith('event:')) {
                eventType = line.slice(6).trim();
              } else if (line.startsWith('data:')) {
                dataStr += line.slice(5).trim();
              }
            }

            if (!dataStr) continue;

            try {
              const data = JSON.parse(dataStr);

              switch (eventType) {
                case 'thinking': {
                  setIsThinking(true);
                  if (data.thought) {
                    setThoughts((prev) => [...prev, data.thought]);
                  }
                  break;
                }
                case 'tool_call': {
                  setIsThinking(true);
                  setToolCalls((prev) => [
                    ...prev,
                    {
                      tool_name: data.tool_name,
                      arguments: data.arguments,
                    },
                  ]);
                  break;
                }
                case 'tool_result': {
                  setToolCalls((prev) =>
                    prev.map((tc) =>
                      tc.tool_name === data.tool_name
                        ? { ...tc, status: data.status, output: data.output }
                        : tc
                    )
                  );
                  break;
                }
                case 'token': {
                  setIsThinking(false);
                  if (typeof data.chunk === 'string') {
                    setContent((prev) => prev + data.chunk);
                  }
                  break;
                }
                case 'done': {
                  setIsThinking(false);
                  setIsStreaming(false);
                  if (typeof data.scaffold_level === 'number') {
                    setScaffoldLevel(data.scaffold_level);
                  }
                  break;
                }
                case 'error': {
                  setIsThinking(false);
                  setIsStreaming(false);
                  setError(data.message || 'Terjadi kesalahan pada reasoning agent');
                  break;
                }
                default: {
                  if (data.chunk) {
                    setIsThinking(false);
                    setContent((prev) => prev + data.chunk);
                  }
                  break;
                }
              }
            } catch (jsonErr) {
              console.warn('Failed to parse SSE JSON chunk:', dataStr, jsonErr);
            }
          }
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          // Stream was manually aborted, do not flag as unexpected error
          return;
        }
        const errorMessage = err instanceof Error ? err.message : 'Gagal menghubungi Hermes Agent';
        setError(errorMessage);
        setIsStreaming(false);
        setIsThinking(false);
      } finally {
        setIsStreaming(false);
        setIsThinking(false);
        abortControllerRef.current = null;
      }
    },
    [abortStream, options?.apiBaseUrl, scaffoldLevel]
  );

  return {
    isThinking,
    thoughts,
    content,
    toolCalls,
    scaffoldLevel,
    isStreaming,
    error,
    sendPrompt,
    abortStream,
    reset,
  };
}
