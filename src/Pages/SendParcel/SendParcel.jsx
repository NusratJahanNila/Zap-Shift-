import { useForm, useWatch } from 'react-hook-form';
import { useLoaderData, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import useAuth from '../../Hooks/useAuth';

const SendParcel = () => {
    const navigate=useNavigate();
    const { user } = useAuth();
    // axios api
    const axiosSecure = useAxiosSecure();
    // api from router
    const serviceCenters = useLoaderData();
    // react hook form
    const {
        register,
        control,
        handleSubmit,
    } = useForm();
    // duplicate rigions
    const regionsData = serviceCenters.map(centers => centers.region)
    // remove duplicate
    const regions = [...new Set(regionsData)];
    const senderRegion = useWatch({ control, name: "senderRegion" })
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
        }
        else {
            if (parcelWeight < 3) {
                cost = isSameDistrict ? 110 : 150;
            }
            else {
                const minCost = isSameDistrict ? 110 : 150;
                const extraWeight = parcelWeight - 3;
                const extraCharge = isSameDistrict ? extraWeight * 40 : extraWeight * 40 + 40;

                cost = minCost + extraCharge;
            }
        }
        // send cost to db
        data.cost = cost;
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

                // save the parcel info to the database
                axiosSecure.post('/parcels', data)
                    .then(res => {
                        console.log('after saving parcel', res.data)

                        if (res.data.insertedId) {
                            navigate('/dashboard/my-parcels')
                            Swal.fire({
                                position: "top-end",
                                icon: "success",
                                title: "Parcel has created.Please pay!",
                                showConfirmButton: false,
                                timer: 2500
                            });
                        }
                    })
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
                                <input type="text" {...register('parcelName', { required: true })} className="input w-full" placeholder="Parcel Name" />
                            </div>

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
                                    <input
                                        defaultValue={user?.displayName || ''}
                                        type="text"
                                        {...register('senderName', { required: true })}
                                        className="input w-full"
                                        placeholder="Sender's name" />
                                    {/* email */}
                                    <label className="label">Sender's Email</label>
                                    <input
                                        defaultValue={user?.email || ''}
                                        type="email"
                                        {...register('senderEmail', { required: true })}
                                        className="input w-full"
                                        placeholder="Sender's email"
                                    />
                                    {/* phone */}
                                    <label className="label">Sender Phone No</label>
                                    <input type="text" {...register('senderPhone', { required: true })} className="input w-full" placeholder="Phone No" />
                                    {/* district */}
                                    <label className="label">Your Region</label>
                                    <select {...register('senderRegion', { required: true })} className="select w-full">
                                        <option value="">Select Your Region</option>
                                        {regions.map((region, index) => (
                                            <option key={index} value={region}>{region}</option>
                                        ))}
                                    </select>

                                    <label className="label">Sender's District</label>
                                    <select {...register('senderDistrict', { required: true })} className="select w-full">
                                        <option value="">Select Your District</option>
                                        {senderRegion &&
                                            districtsByRegion(senderRegion).map((district, index) => (
                                                <option key={index} value={district}>{district}</option>
                                            ))
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
                                    <input type="text" {...register('receiverName', { required: true })} className="input w-full" placeholder="Receiver's name" />
                                    {/* email */}
                                    <label className="label">Receiver's Email</label>
                                    <input type="email" {...register('receiverEmail', { required: true })} className="input w-full" placeholder="Receiver's email" />
                                    {/* phone */}
                                    <label className="label">Receiver Phone No</label>
                                    <input type="text" {...register('receiverPhone', { required: true })} className="input w-full" placeholder="Phone No" />

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
                        <p>* PickUp Time-4pm-7pm-Approx.</p>
                        <button className='bg-primary btn rounded-2xl px-5 '>Proceed to Confirm Booking</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SendParcel;