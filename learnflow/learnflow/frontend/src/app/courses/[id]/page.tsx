'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';

type Chapter = { id: number; title: string; is_public: boolean };
type Course = { id: number; title: string; description: string; chapters: Chapter[] };

export default function CourseDetail() {
  const params = useParams<{ id: string }>();
  const id = params?.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [joined, setJoined] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await api(`/api/courses/${id}/`);
        if (!res.ok) { setErr(`Failed: ${res.status}`); return; }
        const data = await res.json();
        setCourse(data);
      } catch (e: any) {
        setErr(e.message || 'Error loading course');
      }
    })();
  }, [id]);

  const join = async () => {
    const res = await api(`/api/courses/${id}/join/`, { method: 'POST' });
    if (res.ok) setJoined(true);
  };

  if (err) return <p className="p-8 text-red-600">{err}</p>;
  if (!course) return <p className="p-8">Loading...</p>;

  const publicChapters = (course.chapters || []).filter(ch => ch.is_public);

  return (
    <div>
      <h1 className="text-2xl font-semibold">{course.title}</h1>
      <p className="text-gray-600 mb-4">{course.description}</p>

      <button onClick={join} className="px-3 py-1.5 bg-black text-white rounded">
        {joined ? 'Joined' : 'Join course'}
      </button>

      <h2 className="text-xl font-semibold mt-8 mb-2">Public Chapters</h2>
      <ul className="space-y-2">
        {publicChapters.map(ch => (
          <li key={ch.id}>
            <a className="text-blue-600" href={`/chapters/${ch.id}`}>{ch.title}</a>
          </li>
        ))}
        {publicChapters.length === 0 && (
          <li className="text-gray-500">No public chapters yet.</li>
        )}
      </ul>
    </div>
  );
}
