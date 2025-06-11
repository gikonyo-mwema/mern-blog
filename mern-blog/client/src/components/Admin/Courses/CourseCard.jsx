import { Link } from 'react-router-dom';
import { Card } from 'flowbite-react';

export default function CourseCard({ course }) {
  return (
    <Link to={`/courses/${course.slug}`} className="block h-full">
      <Card className="h-full hover:shadow-lg transition-shadow duration-300">
        <div className="flex flex-col items-center text-center h-full">
          <div className="mb-4">
            {course.icon}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
          <p className="text-gray-600 flex-grow">{course.shortDescription}</p>
          <div className="mt-4 text-teal-600 font-medium">
            Learn more →
          </div>
        </div>
      </Card>
    </Link>
  );
}