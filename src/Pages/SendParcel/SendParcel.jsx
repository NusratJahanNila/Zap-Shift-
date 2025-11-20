import React, { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useLoaderData } from 'react-router';
import Swal from 'sweetalert2';

const SendParcel = () => {
    // Delivery charge
    const [cost, setCost] = useState(0)
    // api
    const serviceCenters = useLoaderData();
    // react hook form
    const { register, control, handleSubmit, formState: { errors } } = useForm();
    // duplicate rigions
    const regionsData = serviceCenters.map(centers => centers.region)
    // remove duplicate
    const regions = [...new Set(regionsData)];
    const senderRegion = useWatch({ control, name: "sender-region" })
    const receiverRegion = useWatch({ control, name: "receiverRegion" })

    // get districts of a particular region
    const districtsByRegion = region => {
        const regionDistricts = serviceCenters.filter(center => center.region === region);
        const districts = regionDistricts.map(d => d.district)
        return districts;
    }

    // send percel
    const handleSendParcel = (data) => {
        // cost calculate
        const isDocument = data.parcelType === 'document';
        const isSameDistrict = data.senderDistrict === data.receiverDistrict;
        const parcelWeight = parseFloat(data.parcelWeight)
        // console.log({isDocument,isSameDistrict,parcelWeight})
        let cost = 0;
        if (isDocument) {
            cost = isSameDistrict ? 60 : 80;
            setCost(cost);
        }
        else {
            if (parcelWeight < 3) {
                cost = isSameDistrict ? 110 : 150;
                setCost(cost);
            }
            else {
                const minCost = isSameDistrict ? 110 : 150;
                const extraWeight = parcelWeight - 3;
                const extraCharge = isSameDistrict ? extraWeight * 40 : extraWeight * 40 + 40;

                cost = minCost + extraCharge;
                setCost(cost);
            }
        }
        Swal.fire({
            title: "Agree with the cost?",
            text: `You will be charged ${cost}Tk`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, confirm it!"
        }).then((result) => {
            if (result.isConfirmed) {
                // Swal.fire({
                //     title: "Confirmed!",
                //     text: "Your order has been placed.",
                //     icon: "success"
                // });
            }
        });
    }
    return (
        <div className="max-w-7xl mx-auto">
            <div className='max-w-5xl mx-auto p-5 my-5 bg-white rounded-2xl'>
                <h2 className='text-3xl font-extrabold text-secondary my-3'>Send A Parcel</h2>
                <p className='text-secondary font-bold my-3'>Enter your parcel details</p>
                <form onSubmit={handleSubmit(handleSendParcel)}>
                    {/* sec-1 */}
                    <div className="">
                        {/* check box */}
                        <div className="space-x-3">
                            <label >
                                <input type="radio" {...register('parcelType', { required: true })} className="radio text-secondary" defaultChecked value="document" /> Document
                            </label>
                            <label>
                                <input type="radio" {...register('parcelType', { required: true })} className="radio text-secondary" defaultChecked value="non-document" />
                                Non-Document
                            </label>
                        </div>
                        <div className="border border-gray-200 my-5"></div>
                        {/* parcel details */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                            <div className="grid grid-cols-1 mt-1">
                                <label className="label">Parcel Name</label>
                                <input type="text" {...register('parcel-name', { required: true })} className="input w-full" placeholder="Parcel Name" />
                            </div>
                            {errors?.parcel - name.type === 'required' && <p className='text-red-600'>Parcel name is required</p>}
                            <div className="grid grid-cols-1">
                                <label className="label">Parcel Weight (KG)</label>
                                <input type="text" {...register('parcelWeight', { required: true })} className="input w-full" placeholder="Parcel Weight (KG)" />
                            </div>
                        </div>
                    </div>
                    <div className="border border-gray-200 mt-10"></div>
                    {/* sec-2 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 ">
                        {/* sender details */}
                        <div>
                            <div className="card-body">
                                <h1 className="text-secondary font-bold">Sender's Details</h1>
                                <fieldset className="fieldset">
                                    {/* name */}
                                    <label className="label">Sender's name</label>
                                    <input type="text" {...register('sender-name', { required: true })} className="input w-full" placeholder="Sender's name" />
                                    {/* email */}
                                    <label className="label">Sender's Email</label>
                                    <input type="email" {...register('sender-email', { required: true })} className="input w-full" placeholder="Sender's email" />
                                    {/* address */}
                                    <label className="label">Address</label>
                                    <input type="text" {...register('sender-address', { required: true })} className="input w-full" placeholder="Address" />
                                    {/* phone */}
                                    <label className="label">Sender Phone No</label>
                                    <input type="text" {...register('sender-phone', { required: true })} className="input w-full" placeholder="Phone No" />
                                    {/* district */}
                                    <label className="label">Your Region</label>
                                    <select defaultValue="Select Your Region" {...register('sender-region', { required: true })} className="select w-full">
                                        <option disabled={true}>Select Your Region</option>
                                        {
                                            regions.map((region, index) => <option key={index} value={region}>{region}</option>)
                                        }

                                    </select>

                                    <label className="label">Your District</label>
                                    <select defaultValue="Select Your District" {...register('senderDistrict', { required: true })} className="select w-full">
                                        <option disabled={true}>Select Your District</option>
                                        {
                                            districtsByRegion(senderRegion).map((region, index) => <option key={index} value={region}>{region}</option>)
                                        }

                                    </select>

                                    {/* instruction */}
                                    <label className="label">Pickup Instruction</label>
                                    <textarea rows={3} cols={5} {...register('senderTxt')} className='border border-gray-200 p-2 rounded-lg' placeholder='Pickup Instruction'></textarea>
                                </fieldset>
                            </div>
                        </div>
                        {/* receiver details */}
                        <div>
                            <div className="card-body">
                                <h1 className="text-secondary font-bold">Receiver Details</h1>
                                <fieldset className="fieldset">
                                    {/* name */}
                                    <label className="label">Receiver's name</label>
                                    <input type="text" {...register('receiver-name', { required: true })} className="input w-full" placeholder="Receiver's name" />
                                    {/* email */}
                                    <label className="label">Receiver's Email</label>
                                    <input type="email" {...register('receiver-email', { required: true })} className="input w-full" placeholder="Receiver's email" />
                                    {/* address */}
                                    <label className="label">Address</label>
                                    <input type="text" {...register('receiver-address', { required: true })} className="input w-full" placeholder="Address" />
                                    {/* phone */}
                                    <label className="label">Receiver Phone No</label>
                                    <input type="text" {...register('receiver-phone', { required: true })} className="input w-full" placeholder="Phone No" />

                                    {/* district */}
                                    <label className="label">Receiver's Region</label>
                                    <select defaultValue="Select Your Region" {...register('receiverRegion', { required: true })} className="select w-full">
                                        <option disabled={true}>Select Your Region</option>
                                        {
                                            regions.map((region, index) => <option key={index} value={region}>{region}</option>)
                                        }

                                    </select>

                                    <label className="label">Receiver's District</label>
                                    <select defaultValue="Select Your District" {...register('receiverDistrict', { required: true })} className="select w-full">
                                        <option disabled={true}>Select Your District</option>
                                        {
                                            districtsByRegion(receiverRegion).map((region, index) => <option key={index} value={region}>{region}</option>)
                                        }

                                    </select>

                                    {/* instruction */}
                                    <label className="label">Delivery Instruction</label>
                                    <textarea rows={3} cols={5} {...register('receiverTxt')} className='border border-gray-200 p-2 rounded-lg' placeholder='Delivery Instruction'></textarea>
                                </fieldset>
                            </div>
                        </div>
                    </div>
                    {/* sec-3 */}
                    <div className="mt-5 space-y-3">
                        <p className='font-bold text-secondary'>*Delivery charge : <span className='text-gray-500'>{cost} ৳</span></p>
                        <p>* PickUp Time-4pm-7pm-Approx.</p>
                        <button className='bg-primary btn rounded-2xl px-5 '>Proceed to Confirm Booking</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SendParcel;