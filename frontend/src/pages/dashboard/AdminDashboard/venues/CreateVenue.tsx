import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { venuesAPI } from "../../../../Features/venues/venuesAPI";
import { toast } from "sonner";


const schema = yup.object({
    name: yup.string().max(50).required(),
    address: yup.string().max(150).required(),
    capacity: yup.number().required(),
    contactNumber: yup.string().required(),
});

type CreateVenueInputs = yup.InferType<typeof schema>;

const CreateVenue = () => {
  const [createVenue, { isLoading }] = venuesAPI.useCreateVenueMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateVenueInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<CreateVenueInputs> = async (data) => {
    try {
    //   console.log("Form Data Submitted:", data);

      await createVenue({ ...data}).unwrap();
      toast.success("Venue created successfully!");
      reset();
      (document.getElementById("my_modal_5") as HTMLDialogElement)?.close();
    } catch (error) {
      toast.error("Failed to create event.");
    }
  };

  return (
    <dialog id="my_modal_5" className="modal sm:modal-middle">
      <div className="modal-box bg-gray-600 text-white max-w-xl">
        <h3 className="font-bold text-lg mb-4">Create New Venue</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input {...register("name")} placeholder="Name" className="input w-full" />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          <input  {...register("address")} placeholder="Address" className="input w-full" />
          {errors.address && <p className="text-red-500">{errors.address.message}</p>}
          <input type="number" {...register("capacity")} placeholder="Capacity" className="input w-full" />
          {errors.capacity && <p className="text-red-500">{errors.capacity.message}</p>}
          <input {...register("contactNumber")} placeholder="Phone Number" className="input w-full" />
          {errors.contactNumber && <p className="text-red-500">{errors.contactNumber.message}</p>}
          <div className="modal-action">
            <button type="submit" className="btn btn-primary"disabled={isLoading}>
              {isLoading ? "Creating..." : "Create"}
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => (document.getElementById("my_modal_5") as HTMLDialogElement)?.close()}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default CreateVenue;