import { Link } from 'react-router-dom';
import {
  FiClipboard,
  FiFileText,
  FiShield,
  FiZap,
  FiBox,
} from 'react-icons/fi';

export default function ServiceCard({ service }) {
  const getIconComponent = (iconName) => {
    const iconClass = 'w-8 h-8 text-indigo-600 dark:text-indigo-400';
    switch (iconName) {
      case 'eia-icon.svg':
        return <FiClipboard className={iconClass} />;
      case 'audit-icon.svg':
        return <FiFileText className={iconClass} />;
      case 'policy-icon.svg':
        return <FiShield className={iconClass} />;
      case 'climate-icon.svg':
        return <FiZap className={iconClass} />;
      default:
        return <FiBox className={iconClass} />;
    }
  };

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md dark:shadow-gray-900/50 dark:hover:shadow-gray-700/30 overflow-hidden transition-all duration-300 h-full flex flex-col items-center text-center border border-gray-100 dark:border-gray-700 hover:border-indigo-100 dark:hover:border-indigo-900/50">
      {/* Icon */}
      <div className="relative p-6 pb-0">
        <div className="w-20 h-20 flex items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition-colors duration-300">
          {getIconComponent(service.icon)}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow items-center text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
          {service.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {service.shortDescription}
        </p>

        <Link
          to={`/services/${service._id}`}
          className="mt-auto inline-flex items-center text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
          aria-label={`Learn more about ${service.title}`}
        >
          Learn more
          <svg
            className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}

