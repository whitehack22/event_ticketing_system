import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { venuesAPI, type TVenue } from "../../../../Features/venues/venuesAPI";
import { toast } from "sonner";

const schema = yup.object({
  name: yup.string().max(50).required(),
  address: yup.string().max(150).required(),
  capacity: yup.number().required(),
  contactNumber: yup.string().required(),
});

type UpdateVenueInputs = yup.InferType<typeof schema>;

type UpdateVenueProps = {
  venue: TVenue | null;
};

const UpdateVenue = ({ venue }: UpdateVenueProps) => {
  const [updateVenue, { isLoading }] = venuesAPI.useUpdateVenueMutation({
    fixedCacheKey: "updateVenue",
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UpdateVenueInputs>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (venue) {
      setValue("name", venue.name);
      setValue("address", venue.address);
      setValue("capacity", venue.capacity);
      setValue("contactNumber", venue.contactNumber);
    } else {
      reset();
    }
  }, [venue, setValue, reset]);

  const onSubmit: SubmitHandler<UpdateVenueInputs> = async (data) => {
    try {
      if (!venue) {
        toast.error("No venue selected for update.");
        return;
      }   
      const updatedData = { ...data};
      const response = await updateVenue({ ...updatedData, venueID: venue.venueID }).unwrap();

      console.log("Venue updated successfully:", response);
      toast.success("Venue updated successfully!");
      reset();
      (document.getElementById("update_modal") as HTMLDialogElement)?.close();
    } catch (error) {
      console.error("Error updating venue:", error);
      toast.error("Failed to update venue. Please try again.");
    }
  };

  return (
    <dialog id="update_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-gray-600 text-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg">
        <h3 className="font-bold text-lg mb-4">Update Venue</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input {...register("name")} placeholder="Name" className="input w-full" />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          <input  {...register("address")} placeholder="Address" className="input w-full" />
          {errors.address && <p className="text-red-500">{errors.address.message}</p>}
          <input type="number" {...register("capacity")} placeholder="Capacity" className="input w-full" />
          {errors.capacity && <p className="text-red-500">{errors.capacity.message}</p>}
          <input {...register("contactNumber")} placeholder="Phone Number" className="input w-full" />
          {errors.contactNumber && <p className="text-red-500">{errors.contactNumber.message}</p>}

          <div className="modal-action">
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? <span className="loading loading-spinner text-primary" /> : "Update"}
            </button>
            <button
              className="btn"
              type="button"
              onClick={() => {
                (document.getElementById("update_modal") as HTMLDialogElement)?.close();
                reset();
              }}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default UpdateVenue;
