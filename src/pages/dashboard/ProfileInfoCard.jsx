import React from 'react';
import {
  Card,
  CardBody,
  Typography,
  Tooltip,
  Button,
} from '@material-tailwind/react';
import { PencilIcon } from '@heroicons/react/24/solid';

const ProfileInfoCard = ({ title, description, details, action }) => {
  return (
    <Card>
      <CardBody>
        <Typography variant="h5" className="mb-2">
          {title}
        </Typography>
        <Typography className="mb-4 text-blue-gray-600">
          {description}
        </Typography>
        <div className="grid gap-2">
          {Object.entries(details).map(([key, value]) => (
            <div key={key} className="flex gap-1">
              <Typography className="font-medium  text-black ">
                {key}:
              </Typography>
              <Typography className="text-blue-gray-600">{value}</Typography>
            </div>
          ))}
        </div>
        {action && <div className="mt-4">{action}</div>}
      </CardBody>
    </Card>
  );
};

export default ProfileInfoCard;
