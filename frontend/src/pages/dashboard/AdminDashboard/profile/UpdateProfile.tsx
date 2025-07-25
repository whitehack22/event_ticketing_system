import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { userAPI } from "../../../../Features/users/usersAPI";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import axios from "axios";


const schema = yup.object({
    firstName: yup.string().max(50, "Max 50 characters").required("First name is required"),
    lastName: yup.string().max(50, "Max 50 characters").required("Last name is required"),
    contactPhone: yup.string().max(50, "Max 50 characters").required("Phone Number is required"),
    address: yup.string().max(50, "Max 50 characters").required("Address is required"),
    image_url: yup.string().url("Invalid URL").required("Image URL is required"),
});

type UpdateProfileInputs = yup.InferType<typeof schema>;

interface User {
    userID: string | number;
    firstName?: string;
    lastName?: string;
    contactPhone?: string;
    address?: string;
    image_url?: string;
}

interface UpdateProfileProps {
    user: User;
    refetch?: () => void;
}

const UpdateProfile = ({ user, refetch }: UpdateProfileProps) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
      const [uploading, setUploading] = useState(false);

    const [updateUser, { isLoading }] = userAPI.useUpdateUserMutation(
        { fixedCacheKey: "updateUser" }
    );

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<UpdateProfileInputs>({
        resolver: yupResolver(schema),
        defaultValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            contactPhone: user?.contactPhone || "",
            address: user?.address || "",
            image_url: user?.image_url || "",
        },
    });

    // Update form values when user changes
    useEffect(() => {
        if (user) {
            setValue("firstName", user.firstName || "");
            setValue("lastName", user.lastName || "");
            setValue("contactPhone", user.contactPhone || "");
            setValue("address", user.address || "");
            setValue("image_url", user.image_url || "");
        } else {
            reset();
        }
    }, [user, setValue, reset]);


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

    const onSubmit: SubmitHandler<UpdateProfileInputs> = async (data) => {
        try {
            console.log('Update Profile data:', data);
            let imageUrl = data.image_url;
            if (imageFile) {
                const uploadedUrl = await uploadImageToCloudinary();
                if (uploadedUrl) imageUrl = uploadedUrl;
                else return;
            }

            await updateUser({ userID: Number(user.userID), ...data, image_url: imageUrl }).unwrap()

            toast.success("Profile updated successfully!");
            if (refetch) {
                refetch(); // Call refetch if provided
            }
            reset();
            (document.getElementById('update_profile_modal') as HTMLDialogElement)?.close();
        } catch (error) {
            setUploading(false);
            console.log("Error updating profile:", error);
            toast.error("Failed to update profile. Please try again.");
        }
    };

    return (
        <dialog id="update_profile_modal" className="modal sm:modal-middle">
            <div className="modal-box bg-gray-600 text-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg">
                <h3 className="font-bold text-lg mb-4">Update Profile</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <input
                        type="text"
                        {...register("firstName")}
                        placeholder="First Name"
                        className="input rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg bg-white text-gray-800"
                    />
                    {errors.firstName && (
                        <span className="text-sm text-red-700">{errors.firstName.message}</span>
                    )}

                    <input
                        type="text"
                        {...register("lastName")}
                        placeholder="Last Name"
                        className="input rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg bg-white text-gray-800"
                    />
                    {errors.lastName && (
                        <span className="text-sm text-red-700">{errors.lastName.message}</span>
                    )}
                    <input
                        type="text"
                        {...register("contactPhone")}
                        placeholder="Phone Number"
                        className="input rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg bg-white text-gray-800"
                    />
                    {errors.contactPhone && (
                        <span className="text-sm text-red-700">{errors.contactPhone.message}</span>
                    )}
                    <input
                        type="text"
                        {...register("address")}
                        placeholder="Address"
                        className="input rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg bg-white text-gray-800"
                    />
                    {errors.address && (
                        <span className="text-sm text-red-700">{errors.address.message}</span>
                    )}
                    {/* 
                    <input
                        type="text"
                        {...register("image_url")}
                        placeholder="Image URL"
                        className="input rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg bg-white text-gray-800"
                    />
                    {errors.image_url && (
                        <span className="text-sm text-red-700">{errors.image_url.message}</span>
                    )} */}

                    <div className="flex flex-col gap-2">
                    <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="file-input file-input-bordered file-input-primary w-full" />
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

                    {errors.image_url && (
                        <span className="text-sm text-red-700">{errors.image_url.message}</span>
                    )}



                    <div className="modal-action flex flex-col sm:flex-row gap-2">
                        <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={isLoading || uploading}>
                            {(isLoading || uploading) ? (
                                <>
                                    <span className="loading loading-spinner text-primary" /> Updating...
                                </>
                            ) : "Update"}
                        </button>
                        <button
                            className="btn w-full sm:w-auto"
                            type="button"
                            onClick={() => {
                                (document.getElementById('update_profile_modal') as HTMLDialogElement)?.close();
                                reset();
                            }}
                            disabled={isLoading || uploading}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
    );
};

export default UpdateProfile;