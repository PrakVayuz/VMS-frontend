import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Typography, Input, Chip, Button } from "@material-tailwind/react";
import axios from "axios";
import Table from "./Table"; 

const JobDescriptionTable = () => {
  const [jobDescriptions, setJobDescriptions] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [jobDescriptionsPerPage] = useState(5);
  const [totalJobDescriptions, setTotalJobDescriptions] = useState(0);
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    id: "",
    title: "",
    description: "",
    verified: false,
    assignedVendors: [],
    unassignedVendors: [],
  });

  const [isModalOpen, setIsModalOpen] = useState(false); // Added state for modal visibility

  useEffect(() => {
    fetchJobDescriptions(currentPage, jobDescriptionsPerPage);
  }, [currentPage, jobDescriptionsPerPage]);

  const fetchJobDescriptions = async (page, limit) => {
    try {
      const response = await axios.get("http://localhost:3000/api/admin/job-descriptions", {
        params: { page, limit }
      });

      console.log('API Response:', response.data); 

      setJobDescriptions(response.data || []); 
      setTotalJobDescriptions(response.data.length || 0);
    } catch (error) {
      console.error("Error fetching job descriptions:", error);
    }
  };

  const filteredJobDescriptions = jobDescriptions.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase())
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const columns = [
    { field: "_id", label: "Job ID" },
    { field: "title", label: "Job Title" },
    { field: "verified", label: "Status", render: (verified, item) => (
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={verified}
          onChange={() => handleStatusToggle(item)}
          className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out mr-2"
        />
        <Typography>{verified ? "Verified" : "Not Verified"}</Typography>
      </div>
    )},
    { field: "assignedVendors", label: "Assignees", render: (assignedVendors, item) => (
      <>
        {assignedVendors.map((vendor) => (
          <Chip key={vendor._id} color="indigo" value={vendor.username} className="mr-2 mb-2" />
        ))}
        <Button
          color="blue"
          buttonType="link"
          size="sm"
          ripple="dark"
          onClick={() => handleAssignVendors(item._id)}
        >
          Assign +
        </Button>
      </>
    )},
    { field: "actions", label: "Actions", render: (item) => (
      <>
        <Button
          color="blue"
          buttonType="link"
          size="sm"
          ripple="dark"
          onClick={() => handleEdit(item)}
        >
          Edit
        </Button>
        <Button
          color="red"
          buttonType="link"
          size="sm"
          ripple="dark"
          onClick={() => handleDelete(item._id)}
        >
          Delete
        </Button>
      </>
    )}
  ];

  const handleEdit = (item) => {
    setIsUpdateFormOpen(true);
    setUpdateFormData((prevData) => ({
      ...prevData,
      id: item._id, // Set the id here
      title: item.title,
      description: item.description,
      verified: item.verified,
    }));
  };

  const handleAssignVendors = async (jobId) => {
    console.log("Assigning vendors for job ID:", jobId);
    try {
      const jobResponse = await axios.get(`http://localhost:3000/api/admin/job-description/${jobId}`);
      const allVendorsResponse = await axios.get("http://localhost:3000/api/vendor/vendors");

      if (!Array.isArray(allVendorsResponse.data.vendors)) {
        console.error("Expected an array of vendors, but received:", allVendorsResponse.data);
        return;
      }

      const assignedVendors = jobResponse.data.assignedVendors;
      const allVendors = allVendorsResponse.data.vendors;

      const unassignedVendors = allVendors.filter(
        (vendor) => !assignedVendors.some((assignedVendor) => assignedVendor._id === vendor._id)
      );

      setUpdateFormData((prevData) => ({
        ...prevData,
        assignedVendors,
        unassignedVendors,
        id: jobId,
      }));

      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching job description or vendors:", error.message);
      // Handle specific errors (e.g., 404, network issues) here
    }
  };

  const handleAssignVendor = async (vendor) => {
    // Update frontend state
    const updatedAssignedVendors = [...updateFormData.assignedVendors, vendor];
    const updatedUnassignedVendors = updateFormData.unassignedVendors.filter(
      (unassignedVendor) => unassignedVendor._id !== vendor._id
    );

    setUpdateFormData((prevData) => ({
      ...prevData,
      assignedVendors: updatedAssignedVendors,
      unassignedVendors: updatedUnassignedVendors,
    }));

    try {
      const response = await axios.put(`http://localhost:3000/api/admin/assign-vendor`, {
        jobId: updateFormData.id,
        vendorId: vendor._id,
      });

      console.log('Assign Vendor API Response:', response.data);
    } catch (error) {
      console.error("Error assigning vendor:", error);
    }
  };

  const handleRemoveVendor = async (vendor) => {
    // Update frontend state
    const updatedUnassignedVendors = [...updateFormData.unassignedVendors, vendor];
    const updatedAssignedVendors = updateFormData.assignedVendors.filter(
      (assignedVendor) => assignedVendor._id !== vendor._id
    );

    setUpdateFormData((prevData) => ({
      ...prevData,
      assignedVendors: updatedAssignedVendors,
      unassignedVendors: updatedUnassignedVendors,
    }));

    try {
      const response = await axios.put(`http://localhost:3000/api/admin/unassign-vendor`, {
        jobId: updateFormData.id,
        vendorId: vendor._id,
      });

      console.log('Unassign Vendor API Response:', response.data);
    } catch (error) {
      console.error("Error unassigning vendor:", error);
    }
  };

  const handleStatusToggle = async (item) => {
    const updatedJobDescriptions = jobDescriptions.map((job) =>
      job._id === item._id ? { ...job, verified: !item.verified } : job
    );

    try {
      const response = await axios.put(`http://localhost:3000/api/admin/${item._id}/update-status`, {
        id: item._id,
        verified: !item.verified,
      });

      console.log('Toggle Status API Response:', response.data.vendors);

      setJobDescriptions(updatedJobDescriptions);
    } catch (error) {
      console.error(`Error toggling status for job description with id ${item._id}:`, error);
    }
  };

  const handleUpdate = async () => {
    try {
      const { id, title, description, assignedVendors } = updateFormData;
      const response = await axios.put(`http://localhost:3000/api/admin/update/${id}`, {
        title,
        description,
        assignedVendors,
        verified: updateFormData.verified, // Include verified status in update
      });

      console.log('Update API Response:', response.data); // Debugging log

      setIsUpdateFormOpen(false);
      fetchJobDescriptions(currentPage, jobDescriptionsPerPage);
    } catch (error) {
      console.error("Error updating job description:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/admin/delete/${id}`);
      console.log('Delete API Response:', response.data);

      fetchJobDescriptions(currentPage, jobDescriptionsPerPage);
    } catch (error) {
      console.error(`Error deleting job description with id ${id}:`, error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const sendEmail = async (vendorId) => {
    try {
      const response = await axios.post("http://localhost:3000/api/admin/send-email", {
        vendorId,
        jobId:"66879618f3ec9c28497c0305",
        jobTitle:"Web Developer"
      });
      console.log('Send Email Response:', response.data);
      alert('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error sending email');
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Job Description Table
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by job title"
            className="mb-4"
          />
          <Table columns={columns} data={filteredJobDescriptions} />
          <div className="flex justify-center mt-4">
            {Array.from({ length: Math.ceil(totalJobDescriptions / jobDescriptionsPerPage) }).map(
              (_, index) => (
                <Button
                  key={index}
                  color="blue"
                  buttonType={currentPage === index + 1 ? "filled" : "outline"}
                  size="sm"
                  ripple="dark"
                  onClick={() => paginate(index + 1)}
                  className="mx-1"
                >
                  {index + 1}
                </Button>
              )
            )}
          </div>
        </CardBody>
      </Card>
      {isUpdateFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-1/2">
            <Typography variant="h6" className="mb-4">
              Update Job Description
            </Typography>
            <form>
              <Input
                type="text"
                name="title"
                value={updateFormData.title}
                onChange={handleInputChange}
                placeholder="Job Title"
                className="mb-4"
              />
              <Input
                type="text"
                name="description"
                value={updateFormData.description}
                onChange={handleInputChange}
                placeholder="Job Description"
                className="mb-4"
              />
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={updateFormData.verified}
                  onChange={() => setUpdateFormData({ ...updateFormData, verified: !updateFormData.verified })}
                  className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out mr-2"
                />
                <Typography>{updateFormData.verified ? "Verified" : "Not Verified"}</Typography>
              </div>
              <Button color="blue" onClick={handleUpdate}>
                Update
              </Button>
              <Button color="red" onClick={() => setIsUpdateFormOpen(false)} className="ml-2">
                Cancel
              </Button>
            </form>
          </div>
        </div>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-1/2">
            <Typography variant="h6" className="mb-4">
              Assign Vendors
            </Typography>
            <div>
              <Typography variant="subtitle1" className="mb-2">
                Assigned Vendors:
              </Typography>
              {updateFormData.assignedVendors.map((vendor) => (
                <div key={vendor._id} className="flex items-center mb-2">
                  <Chip color="indigo" value={vendor.username} className="mr-2" />
                  <Button color="red" size="sm" onClick={() => handleRemoveVendor(vendor)}>
                    Remove
                  </Button>
                   <Button
                   color="green"
                   size="sm"
                   className="ml-2"
                   onClick={() => sendEmail(vendor._id)}
                   >
              Send Email
            </Button>
                </div>
              ))}
            </div>
            <div>
              <Typography variant="subtitle1" className="mb-2">
                Unassigned Vendors:
              </Typography>
              {updateFormData.unassignedVendors.map((vendor) => (
                <div key={vendor._id} className="flex items-center mb-2">
                  <Chip color="gray" value={vendor.username} className="mr-2" />
                  <Button color="blue" size="sm" onClick={() => handleAssignVendor(vendor)}>
                    Assign
                  </Button>
                </div>
              ))}
            </div>
            <Button color="red" onClick={() => setIsModalOpen(false)} className="mt-4">
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDescriptionTable;
