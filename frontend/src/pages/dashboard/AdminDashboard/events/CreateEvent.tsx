import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { eventsAPI } from "../../../../Features/events/eventsAPI";
import { toast } from "sonner";
import { useState } from "react";
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
});

type CreateEventInputs = yup.InferType<typeof schema>;

const CreateEvent = () => {
  const [createEvent, { isLoading }] = eventsAPI.useCreateEventMutation();
  const [imagePreview, setImagePreview] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateEventInputs>({
    resolver: yupResolver(schema),
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await axios.post(import.meta.env.VITE_CLOUDINARY_URL, formData);
      setImagePreview(res.data.secure_url);
      setValue("image_url", res.data.secure_url);
      toast.success("Image uploaded!");
    } catch (error) {
      toast.error("Image upload failed");
    }
  };

  const onSubmit: SubmitHandler<CreateEventInputs> = async (data) => {
    try {
      console.log("Form Data Submitted:", data);

      const eventDateOnly = new Date(data.eventDate).toISOString().split("T")[0]; // "2025-08-15"
      const startTimeISO = new Date(`${eventDateOnly}T${data.startTime}`).toISOString();
      const endTimeISO = new Date(`${eventDateOnly}T${data.endTime}`).toISOString();
      const booleanIsActive = data.isActive === true;

      await createEvent({
        ...data,
        isActive: booleanIsActive,
        startTime: startTimeISO,
        endTime: endTimeISO,
      }).unwrap();
      toast.success("Event created successfully!");
      reset();
      (document.getElementById("my_modal_5") as HTMLDialogElement)?.close();
    } catch (error) {
      toast.error("Failed to create event.");
    }
  };

  return (
    <dialog id="my_modal_5" className="modal sm:modal-middle">
      <div className="modal-box bg-gray-600 text-white max-w-xl">
        <h3 className="font-bold text-lg mb-4">Create New Event</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input {...register("title")} placeholder="Title" className="input w-full" />
          {errors.title && <p className="text-red-500">{errors.title.message}</p>}

          <textarea {...register("description")} placeholder="Description" className="textarea w-full" />
          {errors.description && <p className="text-red-500">{errors.description.message}</p>}

          <select {...register("category")} className="select w-full text-gray-900">
            <option value="">Select Category</option>
            <option value="Music">Music</option>
            <option value="Art">Art</option>
            <option value="Tech">Tech</option>
            <option value="Sports">Sports</option>
            <option value="Gaming">Gaming</option>
            <option value="Food">Food</option>
            <option value="Education">Education</option>
            <option value="Festivals">Festivals</option>
          </select>
          {errors.category && <p className="text-red-500">{errors.category.message}</p>}
          <input type="date" {...register("eventDate")} className="input w-full" />
          <input type="time" {...register("startTime")} className="input w-full" />
          <input type="time" {...register("endTime")} className="input w-full" />
          <input {...register("ticketPrice")} placeholder="Ticket Price" className="input w-full" />
          <input type="number" {...register("totalTickets")} placeholder="Total Tickets" className="input w-full" />
          <input type="number" {...register("availableTickets")} placeholder="Available Tickets" className="input w-full" />
          <input type="number" {...register("venueID")} placeholder="Venue ID" className="input w-full" />
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

          <div>
            <label className="block mb-1">Upload Event Image</label>
            <input type="file" onChange={handleImageUpload} className="file-input file-input-bordered w-full" />
            {imagePreview && <img src={imagePreview} alt="Preview" className="w-24 h-24 rounded-full object-cover mx-auto mb-2" />}
            {errors.image_url && <p className="text-red-500">{errors.image_url.message}</p>}
          </div>

          <div className="modal-action">
            <button type="submit" className="btn btn-primary"disabled={isLoading || !imagePreview}>
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

export default CreateEvent;