'use client';

import { useState, useEffect, type FormEvent } from 'react'; // <-- FIX IS HERE
import { useAuth } from '@/store/auth';
import Link from 'next/link';
import { api } from '@/lib/api';

type Course = {
  id: number;
  title: string;
  code: string;
  instructor: number;
};

function InstructorDashboard() {
  const user = useAuth((s) => s.user);
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');

  // This function is working
  useEffect(() => {
    if (!user) return;
    const fetchCourses = async () => {
      try {
        const res = await api('/api/courses/');
        if (!res.ok) throw new Error('Failed to fetch courses');
        const data = await res.json();
        const allCourses: Course[] = data.results ?? [];
        const courses = allCourses.filter(c => c.instructor === user.id);
        setMyCourses(courses);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchCourses();
  }, [user]);

  // This function is also working
  const handleCreateCourse = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api('/api/courses/', {
        method: 'POST',
        body: JSON.stringify({ title, code, description }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(JSON.stringify(errData));
      }
      const newCourse = await res.json();
      setMyCourses([...myCourses, newCourse]);
      setTitle('');
      setCode('');
      setDescription('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My Courses</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      
      <ul className="space-y-2 mb-8">
        {myCourses.length > 0 ? (
          myCourses.map(course => (
            // This is the link to the manage page
            <li key={course.id}>
              <Link
                href={`/instructor/courses/${course.id}`}
                className="block p-4 bg-white border rounded shadow-sm hover:bg-gray-50"
              >
                <h3 className="font-medium">{course.title} ({course.code})</h3>
                <span className="text-sm text-blue-600">Manage Course & Chapters</span>
              </Link>
            </li>
          ))
        ) : (
          <p className="text-gray-500">You have not created any courses yet.</p>
        )}
      </ul>

      {/* This form is unchanged */}
      <form onSubmit={handleCreateCourse} className="p-4 bg-white border rounded shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Create New Course</h2>
        <div className="space-y-3">
          <input
            className="w-full border rounded p-2"
            placeholder="Course Title (e.g., Introduction to Python)"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <input
            className="w-full border rounded p-2"
            placeholder="Course Code (e.g., CS101)"
            value={code}
            onChange={e => setCode(e.target.value)}
            required
          />
          <textarea
            className="w-full border rounded p-2"
            placeholder="Course Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <button type="submit" className="px-4 py-2 bg-black text-white rounded">
            Create Course
          </button>
        </div>
      </form>
    </div>
  );
}

// Student Dashboard (Unchanged)
function StudentDashboard() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Student Dashboard</h2>
      <p className="mb-4">Welcome! Here you can see your enrolled courses.</p>
      <Link href="/courses" className="text-blue-600 hover:underline">
        Browse all courses
      </Link>
    </div>
  );
}

// Main Page Component (Unchanged)
export default function DashboardPage() {
  const user = useAuth((s) => s.user);
  const ready = useAuth((s) => s.ready);

  if (!ready) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return (
      <div>
        <h1 className="text-2xl font-semibold">Access Denied</h1>
        <p className="mt-2">
          Please <Link href="/login" className="text-blue-600 hover:underline">log in</Link> to view your dashboard.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      {user.role === 'instructor' ? (
        <InstructorDashboard />
      ) : (
        <StudentDashboard />
      )}
    </div>
  );
}