'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function ChapterRead({ params }: { params: { id: string } }) {
  const [title, setTitle] = useState('');
  const [html, setHtml] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await api(`/api/chapters/${params.id}/`);
        if (!res.ok) { setError(`Failed to load (status ${res.status})`); return; }
        const data = await res.json();
        setTitle(data.title || '');
        // FIX: Changed data.content_html to data.content
        setHtml(data.content || '');
      } catch (e: any) {
        setError(e.message || 'Error loading chapter');
      }
    })();
  }, [params.id]);

  if (error) return <main className="max-w-3xl mx-auto py-10"><p className="text-red-600">{error}</p></main>;

  return (
    <main className="max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-6">{title}</h1>
      <article
        className="prose prose-neutral max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </main>
  );
}