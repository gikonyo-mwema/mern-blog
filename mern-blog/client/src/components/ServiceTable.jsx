import React from 'react';
import { Table, Button } from 'flowbite-react';
import { HiOutlinePencilAlt, HiOutlineTrash } from 'react-icons/hi';

export default function ServiceTable({ services, onEdit, onDelete, loading }) {
  return (
    <div className="overflow-x-auto">
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Icon</Table.HeadCell>
          <Table.HeadCell>Title</Table.HeadCell>
          <Table.HeadCell>Category</Table.HeadCell>
          <Table.HeadCell>Price (KES)</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {services.map(service => (
            <Table.Row key={service._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="text-2xl">
                {service.icon || '📋'}
              </Table.Cell>
              <Table.Cell className="font-medium text-gray-900 dark:text-white">
                {service.title}
              </Table.Cell>
              <Table.Cell>
                <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded text-xs">
                  {service.category}
                </span>
              </Table.Cell>
              <Table.Cell>
                {service.price ? service.price.toLocaleString() : 'Free'}
              </Table.Cell>
              <Table.Cell>
                <div className="flex gap-2">
                  <Button
                    outline
                    gradientDuoTone="purpleToBlue"
                    size="xs"
                    onClick={() => onEdit(service)}
                    disabled={loading}
                  >
                    <HiOutlinePencilAlt className="mr-1" />
                    Edit
                  </Button>
                  <Button
                    outline
                    gradientDuoTone="pinkToOrange"
                    size="xs"
                    onClick={() => onDelete(service._id)}
                    disabled={loading}
                  >
                    <HiOutlineTrash className="mr-1" />
                    Delete
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}
