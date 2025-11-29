import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { useRef, useState } from 'react';
import Swal from 'sweetalert2';

const AssignRiders = () => {
    const [selectedParcel, setSelectedParcel] = useState(null);
    const axiosSecure = useAxiosSecure();
    const riderModalRef = useRef();

    console.log(selectedParcel)
    const { data: parcels = [] ,refetch} = useQuery({
        queryKey: ['parcels', 'pending-pickup'],
        queryFn: async () => {
            const res = await axiosSecure.get('/parcels?delivaryStatus=pending-pickup')
            return res.data;
        }
    })
    // query
    const { data: riders = [] } = useQuery({
        queryKey: ['riders', selectedParcel?.senderDistrict, 'available'],
        enabled: !!selectedParcel,
        queryFn: async () => {
            const res = await axiosSecure.get(`/riders?status=approved&riderDistrict=${selectedParcel?.senderDistrict}&workStatus=available`)
            return res.data;
        }
    })
    console.log(riders)

    // modal
    const openAssignRiderModal = (parcel) => {
        setSelectedParcel(parcel)
        riderModalRef.current.showModal();
    }

    // Assign rider 
    const handleAssignRider = rider => {
        const riderAssignInfo = {
            riderId: rider._id,
            riderEmail: rider.email,
            riderName: rider.name,
            parcelId: selectedParcel._id

        }
        axiosSecure.patch(`/parcels/${selectedParcel?._id}`, riderAssignInfo)
            .then(res => {
                if (res.data.modifiedCount) {
                    riderModalRef.current.close();
                    refetch();
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: `Rider has been assigned.`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            })
    }
    return (
        <div className=' max-w-6xl mx-auto py-5'>
            <div className="bg-white rounded-2xl p-4">
                <h2 className='text-2xl text-secondary font-bold'>Assign Riders : <span>{parcels.length}</span></h2>
                <div className="overflow-x-auto">
                    <table className="table table-zebra">
                        {/* head */}
                        <thead>
                            <tr>
                                <th></th>
                                <th>Name</th>
                                <th>Cost</th>
                                <th>Pickup District</th>
                                <th>Created At</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                parcels.map((parcel, index) => <tr key={parcel._id}>
                                    <th>{index + 1}</th>
                                    <td>{parcel.parcelName}</td>
                                    <td>{parcel.cost}</td>
                                    <td>{parcel.senderDistrict}</td>
                                    <td>{parcel.createdAt}</td>
                                    <td>
                                        <button onClick={() => openAssignRiderModal(parcel)} className="btn bg-primary ">Find Rider</button>
                                    </td>
                                </tr>)
                            }

                        </tbody>
                    </table>
                </div>

                {/* Open the modal using document.getElementById('ID').showModal() method */}
                <dialog ref={riderModalRef} className="modal modal-bottom sm:modal-middle">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Riders: {riders.length}</h3>
                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                {/* head */}
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Rider's Name</th>
                                        <th>Email</th>
                                        <th>District</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        riders.map((rider, index) => <tr key={rider._id}>
                                            <th>{index + 1}</th>
                                            <td>{rider.name}</td>
                                            <td>{rider.email}</td>
                                            <td>{rider.riderDistrict}</td>
                                            <td>
                                                <button onClick={() => handleAssignRider(rider)} className="btn bg-primary">
                                                    Assign
                                                </button>
                                            </td>
                                        </tr>)
                                    }

                                </tbody>
                            </table>
                        </div>
                        <div className="modal-action">
                            <form method="dialog">
                                {/* if there is a button in form, it will close the modal */}
                                <button className="btn">Close</button>
                            </form>
                        </div>
                    </div>
                </dialog>
            </div>
        </div>
    );
};

export default AssignRiders;