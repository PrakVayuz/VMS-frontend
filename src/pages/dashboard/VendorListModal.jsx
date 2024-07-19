import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Chip } from "@material-tailwind/react";
import axios from "axios";


const VendorListModal = ({ isOpen, onClose, assignedVendors, onAssignVendor, jobId, jobTitle }) => {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchVendors();
    }
  }, [isOpen]);

  const fetchVendors = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/vendor/vendors");
      console.log('Fetch Vendors Response:', response.data); 
      const allVendors = response.data || [];
      setVendors(allVendors);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };



  return (
    <Modal size="lg" active={isOpen} toggler={onClose}>
      <ModalHeader toggler={onClose}>Assign Vendors</ModalHeader>
      <ModalBody>
        {vendors.map((vendor) => (
          <div key={vendor._id} className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={assignedVendors.some((assignedVendor) => assignedVendor._id === vendor._id)}
              onChange={() => onAssignVendor(vendor)}
              className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out mr-2"
            />
            <Chip color="indigo" value={vendor.username} className="mr-2 mb-2" />
           
          </div>
        ))}
      </ModalBody>
      <ModalFooter>
        <Button color="blue" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default VendorListModal;
