import React from "react";
import { Link } from "react-router-dom";
import { Button, Table, Spinner } from "flowbite-react";

const DataTable = ({ 
  title, 
  data, 
  columns, 
  loading, 
  error, 
  link, 
  onLoadMore 
}) => (
  <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
    <div className="flex justify-between p-3 text-sm font-semibold">
      <h1 className="text-center p-2">{title}</h1>
      {link && (
        <Button outline gradientDuoTone="purpleToPink">
          <Link to={`/dashboard?tab=${link}`}>See all</Link>
        </Button>
      )}
    </div>
    
    {error ? (
      <div className="text-red-500 p-4 text-center">
        Error loading data: {error}
      </div>
    ) : loading ? (
      <div className="flex justify-center items-center min-h-32">
        <Spinner size="xl" />
      </div>
    ) : (
      <>
        <Table hoverable>
          <Table.Head>
            {columns.map((column) => (
              <Table.HeadCell key={column.key}>{column.label}</Table.HeadCell>
            ))}
          </Table.Head>
          <Table.Body>
            {data.length > 0 ? (
              data.map((item) => (
                <Table.Row key={item._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  {columns.map((column) => (
                    <Table.Cell key={`${item._id}-${column.key}`}>
                      {column.render ? column.render(item) : item[column.key]}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={columns.length} className="text-center py-4">
                  No data available
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
        
        {onLoadMore && (
          <div className="flex justify-center mt-2">
            <Button 
              outline 
              gradientDuoTone="greenToBlue"
              onClick={onLoadMore}
            >
              Load More {title.replace('Recent ', '')}
            </Button>
          </div>
        )}
      </>
    )}
  </div>
);

const DashboardTables = ({ 
  data, 
  loading, 
  error, 
  onLoadMore 
}) => {
  const tableConfigs = [
    {
      title: "Recent Users",
      type: "users",
      link: "users",
      columns: [
        { 
          key: "profilePicture", 
          label: "User Image", 
          render: (user) => (
            <img 
              src={user.profilePicture} 
              alt="user" 
              className="w-10 h-10 rounded-full bg-gray-500" 
            />
          )
        },
        { key: "username", label: "Username" }
      ]
    },
    {
      title: "Recent Comments",
      type: "comments",
      link: "comments",
      columns: [
        { 
          key: "content", 
          label: "Comment Content", 
          render: (comment) => (
            <p className="line-clamp-2">{comment.content}</p>
          )
        },
        { key: "numberOfLikes", label: "Likes" }
      ]
    },
    {
      title: "Recent Posts",
      type: "posts",
      link: "posts",
      columns: [
        { 
          key: "image", 
          label: "Post Image", 
          render: (post) => (
            <img 
              src={post.image} 
              alt="post" 
              className="w-14 h-10 rounded-md bg-gray-500" 
            />
          )
        },
        { key: "title", label: "Title" },
        { key: "category", label: "Category" }
      ]
    },
    {
      title: "Recent Services",
      type: "services",
      link: "services",
      columns: [
        { key: "title", label: "Title" },
        { 
          key: "category", 
          label: "Category", 
          render: (service) => (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {service.category}
            </span>
          )
        }
      ]
    },
    {
      title: "Recent Courses",
      type: "courses",
      link: "courses",
      columns: [
        { 
          key: "image", 
          label: "Course Image", 
          render: (course) => (
            <img 
              src={course.image} 
              alt="course" 
              className="w-14 h-10 rounded-md bg-gray-500" 
            />
          )
        },
        { key: "title", label: "Title" },
        { 
          key: "price", 
          label: "Price", 
          render: (course) => `$${course.price}`
        }
      ]
    }
  ];

  return (
    <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
      {tableConfigs.map((config) => (
        <DataTable
          key={config.title}
          title={config.title}
          data={data[config.type]}
          columns={config.columns}
          loading={loading[config.type]}
          error={error[config.type]}
          link={config.link}
          onLoadMore={() => onLoadMore(config.type)}
        />
      ))}
    </div>
  );
};

export default DashboardTables;