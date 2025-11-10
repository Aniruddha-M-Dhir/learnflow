'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';

type Course = { id: number; title: string; description: string };

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [err, setErr] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true); // Add a loading state

  useEffect(() => {
    (async () => {
      try {
        const res = await api('/api/courses/');
        if (!res.ok) { setErr(`Request failed: ${res.status}`); return; }
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data?.results ?? []);
        setCourses(list);
      } catch (e: any) {
        setErr(e.message || 'Failed to load courses');
      } finally {
        setIsLoading(false); // Stop loading
      }
    })();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Courses</h1>
      {err && <p className="text-red-600 mb-4">{err}</p>}
      
      {/* Show loading message */}
      {isLoading && <p>Loading courses...</p>}

      <ul className="grid sm:grid-cols-2 gap-4">
        {!isLoading && courses.map((c) => (
          <li key={c.id} className="border rounded p-4 bg-white">
            <h2 className="font-medium">{c.title}</h2>
            <p className="text-sm text-gray-600">{c.description}</p>
            <Link href={`/courses/${c.id}`} className="text-blue-600 mt-2 inline-block">
              View
            </Link>
          </li>
        ))}
        {!isLoading && courses.length === 0 && !err && (
          <li className="text-gray-500">No courses yet.</li>
        )}
      </ul>
    </div>
  );
}