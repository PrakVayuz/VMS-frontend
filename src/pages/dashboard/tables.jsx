import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Switch,
} from "@material-tailwind/react";
import axios from "axios";
import Table from "./Table"; // Import reusable table component
import { FiEye } from "react-icons/fi";
import { TailSpin } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CreateVendorForm from "./CreateVendorForm"; // Import CreateVendorForm component

export function Tables() {
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [vendorsPerPage] = useState(5);
  const [totalVendors, setTotalVendors] = useState(0);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingIds, setLoadingIds] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false); // State to control form visibility

  useEffect(() => {
    fetchVendors(currentPage, vendorsPerPage);
  }, [currentPage, vendorsPerPage]);

  const fetchVendors = async (page, limit) => {
    try {
      const response = await axios.get("http://localhost:3000/api/vendor/vendors", {
        params: { page, limit }
      });

      console.log('API Response:', response.data); 

      setVendors(response.data.vendors || []); 
      setTotalVendors(response.data.totalVendors || 0);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  const handleToggleVerified = async (id, currentStatus) => {
    setLoadingIds((prev) => [...prev, id]);
    try {
      const response = await axios.put(`http://localhost:3000/api/vendor/${id}/update-verified`, {
        verified: !currentStatus
      });

      console.log('Toggle Verified API Response:', response.data); 
      const updatedVendors = vendors.map((vendor) =>
        vendor._id === id ? { ...vendor, verified: !currentStatus } : vendor
      );
      setVendors(updatedVendors);
      toast.success(`Vendor ${currentStatus ? "unverified" : "verified"} successfully`);
    } catch (error) {
      console.error("Error toggling verified status:", error);
      toast.error("Error toggling verified status");
    }
    setLoadingIds((prev) => prev.filter((vendorId) => vendorId !== id));
  };

  const handleViewVendor = async (vendorId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/vendor/${vendorId}`);
      setSelectedVendor(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching vendor details:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVendor(null);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredVendors = vendors.filter((vendor) =>
    vendor.username.toLowerCase().includes(search.toLowerCase()) ||
    vendor.email.toLowerCase().includes(search.toLowerCase())
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const columns = [
    { field: "username", label: "Username" },
    { field: "email", label: "Email" },
    { field: "registrationDate", label: "Registration Date", render: (date) => new Date(date).toLocaleDateString() },
    { 
      field: "verified", 
      label: "Verified", 
      render: (verified, vendor) => (
        <div className="flex items-center">
          {loadingIds.includes(vendor._id) ? (
            <TailSpin height="20" width="20" color="blue" />
          ) : (
            <Switch
              checked={verified}
              onChange={() => handleToggleVerified(vendor._id, verified)}
              color="blue"
            />
          )}
          <span className="ml-2">{verified ? "Verified" : "Not Verified"}</span>
        </div>
      )
    }
  ];

  const handleCreateVendor = async (vendorData) => {
    try {
      const response = await axios.post("http://localhost:3000/api/admin/create", vendorData);
      console.log('Create Vendor API Response:', response.data);
      toast.success(`Vendor ${vendorData.username} created successfully`);
      fetchVendors(currentPage, vendorsPerPage); // Refresh vendors after creating new one
      setIsFormOpen(false); // Close the form after successful creation
    } catch (error) {
      console.error("Error creating vendor:", error);
     // toast.error("Error creating vendor");
    }
  };


  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <ToastContainer />
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <div className="flex justify-between items-center">
            <Typography variant="h6" color="white">
              Vendors Table
            </Typography>
            <Button
              onClick={() => setIsFormOpen(true)}
              color="blue"
              ripple="light"
            >
              Create Vendor
            </Button>
          </div>
          <div className="flex justify-end">
            <Input
              type="text"
              placeholder="Search by username or email"
              value={search}
              onChange={handleSearch}
              className="w-full max-w-xs"
            />
          </div>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <Table
            columns={columns}
            data={filteredVendors}
            renderActions={(vendor) => (
              <button
                onClick={() => handleViewVendor(vendor._id)}
                className="py-1 px-2 text-xs font-semibold text-blue-gray-600"
              >
                <FiEye/>
              </button>
            )}
          />
        </CardBody>
        <div className="flex justify-center my-4">
          <Pagination
            vendorsPerPage={vendorsPerPage}
            totalVendors={totalVendors}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </Card>

      {selectedVendor && (
        <Dialog open={isModalOpen} onClose={handleCloseModal}>
          <DialogHeader>Vendor Details</DialogHeader>
          <DialogBody>
            <Typography variant="h6">Username: {selectedVendor.username}</Typography>
            <Typography variant="h6">Email: {selectedVendor.email}</Typography>
            <Typography variant="h6">Registration Date: {new Date(selectedVendor.registrationDate).toLocaleDateString()}</Typography>
            <Typography variant="h6">Verified: {selectedVendor.verified ? "Yes" : "No"}</Typography>
            <Typography variant="h6" className="mt-4">Assigned Job Titles:</Typography>
            { selectedVendor?.assignedJobDescriptions?.length === 0 ? "None" : <ul className="list-disc ml-5">
              {selectedVendor?.assignedJobDescriptions?.map((job, index) => (
                <li key={index}>{job.jobTitle}</li>
              ))}
            </ul>}
          </DialogBody>
          <DialogFooter>
            <Button variant="gradient" color="gray" onClick={handleCloseModal}>
              Close
            </Button>
          </DialogFooter>
        </Dialog>
      )}

      {isFormOpen && (
         <CreateVendorForm
         isOpen={isFormOpen}
         onCreateVendor={handleCreateVendor}
         onCancel={() => setIsFormOpen(false)}
       />
      )}
    </div>
  );
}


const Pagination = ({ vendorsPerPage, totalVendors, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalVendors / vendorsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="inline-flex -space-x-px">
        {pageNumbers.map((number) => (
          <li key={number}>
            <button
              onClick={() => paginate(number)}
              className={`py-2 px-3 leading-tight ${
                number === currentPage
                  ? "text-white bg-blue-500 border-blue-500"
                  : "text-blue-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-blue-700"
              }`}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Tables;
