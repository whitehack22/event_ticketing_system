import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { eventsAPI, type TEvent } from "../../../../Features/events/eventsAPI";
import { toast } from "sonner";
import axios from "axios";

const schema = yup.object({
  title: yup.string().max(50).required(),
  description: yup.string().max(150).required(),
  category: yup.string().max(75).required(),
  eventDate: yup.string().required(),
  startTime: yup.string().required(),
  endTime: yup.string().required(),
  ticketPrice: yup.number().required(),
  totalTickets: yup.number().required(),
  availableTickets: yup.number().required(),
  isActive: yup.boolean().default(true),
  image_url: yup.string().url().required("Image upload is required"),
  venueID: yup.number().required().positive().integer(),
  updatedAt: yup.string().required(),
});

type UpdateEventInputs = yup.InferType<typeof schema>;

type UpdateEventProps = {
  event: TEvent | null;
};

const UpdateEvent = ({ event }: UpdateEventProps) => {
  const [updateEvent, { isLoading }] = eventsAPI.useUpdateEventMutation({
    fixedCacheKey: "updateEvent",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UpdateEventInputs>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (event) {
      setValue("title", event.title);
      setValue("description", event.description);
      setValue("category", event.category);
      setValue("eventDate", event.eventDate.slice(0, 10));
      setValue("startTime", event.startTime);
      setValue("endTime", event.endTime);
      setValue("ticketPrice", event.ticketPrice);
      setValue("totalTickets", event.totalTickets);
      setValue("availableTickets", event.availableTickets);
      setValue("isActive", event.isActive);
      setValue("image_url", event.image_url);
      setValue("venueID", event.venueID);
      setValue("updatedAt", event.updatedAt);
    } else {
      reset();
    }
  }, [event, setValue, reset]);

  const uploadImageToCloudinary = async (): Promise<string | null> => {
    if (!imageFile) return null;
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    try {
      setUploading(true);
      const res = await axios.post(import.meta.env.VITE_CLOUDINARY_URL, formData);
      setUploading(false);
      return res.data.secure_url;
    } catch (err) {
      console.error("Image upload error:", err);
      toast.error("Image upload failed.");
      setUploading(false);
      return null;
    }
  };

  const onSubmit: SubmitHandler<UpdateEventInputs> = async (data) => {
    try {
      if (!event) {
        toast.error("No event selected for update.");
        return;
      }

      // Combine eventDate + startTime and endTime
    const eventDateOnly = new Date(data.eventDate).toISOString().split("T")[0]; // e.g. "2025-08-15"
    const startTimeISO = new Date(`${eventDateOnly}T${data.startTime}`).toISOString(); // full timestamp
    const endTimeISO = new Date(`${eventDateOnly}T${data.endTime}`).toISOString();

      let imageUrl = data.image_url;
      if (imageFile) {
        const uploadedUrl = await uploadImageToCloudinary();
        if (uploadedUrl) imageUrl = uploadedUrl;
        else return;
      }

      data.updatedAt = new Date().toISOString();

      const updatedData = { ...data, startTime: startTimeISO, endTime: endTimeISO, image_url: imageUrl, isActive: data.isActive === true };
      const response = await updateEvent({ ...updatedData, eventID: event.eventID }).unwrap();

      console.log("Event updated successfully:", response);
      toast.success("Event updated successfully!");
      reset();
      (document.getElementById("update_modal") as HTMLDialogElement)?.close();
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event. Please try again.");
    }
  };

  return (
    <dialog id="update_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-gray-600 text-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg">
        <h3 className="font-bold text-lg mb-4">Update Event</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input data-testid="update-title" {...register("title")} placeholder="Title" className="input w-full" />
          {errors.title && <span className="text-sm text-red-700">{errors.title.message}</span>}

          <input data-testid="update-description" {...register("description")} placeholder="Description" className="textarea w-full" />
          {errors.description && <span className="text-sm text-red-700">{errors.description.message}</span>}

          <select
            data-testid="update-category"
            {...register("category")}
            className="select select-bordered w-full text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option disabled value="">
              🎯 Select Category
            </option>
            <option value="Music">🎵 Music</option>
            <option value="Art">🎨 Art</option>
            <option value="Tech">💻 Tech</option>
            <option value="Sports">🏀 Sports</option>
            <option value="Gaming">🎮 Gaming</option>
            <option value="Food">🍔 Food</option>
            <option value="Education">📚 Education</option>
            <option value="Festivals">🎉 Festivals</option>
          </select>
          {errors.category && <p className="text-red-500">{errors.category.message}</p>}

          <input data-testid="update-eventDate" type="date" {...register("eventDate")} className="input w-full" />
          {errors.eventDate && <span className="text-sm text-red-700">{errors.eventDate.message}</span>}

          <input data-testid="update-startTime" type="time" {...register("startTime")} className="input w-full" />
          {errors.startTime && <span className="text-sm text-red-700">{errors.startTime.message}</span>}

          <input data-testid="update-endTime" type="time" {...register("endTime")} className="input w-full" />
          {errors.endTime && <span className="text-sm text-red-700">{errors.endTime.message}</span>}

          <input data-testid="update-ticketPrice" {...register("ticketPrice")} placeholder="Ticket Price" className="input w-full" />
          {errors.ticketPrice && <span className="text-sm text-red-700">{errors.ticketPrice.message}</span>}

          <input data-testid="update-totalTickets" type="number" {...register("totalTickets")} placeholder="Total Tickets" className="input w-full" />
          {errors.totalTickets && <span className="text-sm text-red-700">{errors.totalTickets.message}</span>}

          <input data-testid="update-availableTickets" type="number" {...register("availableTickets")} placeholder="Available Tickets" className="input w-full" />
          {errors.availableTickets && <span className="text-sm text-red-700">{errors.availableTickets.message}</span>}

          <input data-testid="update-venueID" type="number" {...register("venueID")} placeholder="Venue ID" className="input w-full" />
          {errors.venueID && <span className="text-sm text-red-700">{errors.venueID.message}</span>}

          <div className="form-control">
                        <label className="label cursor-pointer">
                            <span className="label-text mr-4 text-white">Status</span>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-1">
                                    <input
                                        type="radio"
                                        value="true"
                                        {...register("isActive")}
                                        className="radio radio-primary text-green-400"
                                        defaultChecked
                                    />
                                    True
                                </label>
                                <label className="flex items-center gap-1">
                                    <input
                                        type="radio"
                                        value="false"
                                        {...register("isActive")}
                                        className="radio radio-primary  text-yellow-400"
                                    />
                                    False
                                </label>
                            </div>
                        </label>
                    </div>
                    {errors.isActive && (
                        <span className="text-sm text-red-700">{errors.isActive.message}</span>
                    )}

          {/* <input type="text" {...register("updatedAt")} placeholder="Updated At" className="input text-gray-900" />
          {errors.updatedAt && <span className="text-sm text-red-700">{errors.updatedAt.message}</span>} */}

          <div className="flex flex-col gap-2">
          <input data-testid="update-image" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="file-input file-input-bordered file-input-primary w-full" />
          {
                            imageFile && (
                                <img
                                    src={URL.createObjectURL(imageFile)}
                                    alt="preview"
                                    className="w-24 h-24 rounded-full object-cover mx-auto mb-2"
                                />
                            )
                        } {/* used to preview the image before uploading */} 
          </div>

          <div className="modal-action">
            <button data-testid="update-submit-button" type="submit" className="btn btn-primary" disabled={isLoading || uploading}>
              {isLoading || uploading ? <span className="loading loading-spinner text-primary" /> : "Update"}
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

export default UpdateEvent;
