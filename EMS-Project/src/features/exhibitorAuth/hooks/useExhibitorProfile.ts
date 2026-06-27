import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getExhibitorProfileApi,
  updateExhibitorProfileApi,
  profileKeys,
  type UpdateProfilePayload,
} from "../api/ProfileApi";

export function useExhibitorProfile() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<UpdateProfilePayload>({
    name: "",
    role_title: "",
  });

  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

  const profileQuery = useQuery({
    queryKey: profileKeys.detail(),
    queryFn: getExhibitorProfileApi,
    select: (response) => {
      if (!response?.data || typeof response.data !== "object") {
        throw new Error("Invalid profile payload received from server.");
      }
      return response;
    },
    retry: false, // Prevents infinite refetches on 422/500 backend errors
  });

  useEffect(() => {
    if (profileQuery.data?.data) {
      const data = profileQuery.data.data;
      setFormData({
        name: data.name || "",
        role_title: data.role_title || "",
      });
    }
  }, [profileQuery.data]);

  const mutation = useMutation({
    mutationFn: updateExhibitorProfileApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.detail() });
      setIsEditing(false);
      setPreviewAvatar(null);
    },
  });

  const handleTextChange = (
    field: keyof UpdateProfilePayload,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (file: File | null) => {
    if (!file) return;
    setFormData((prev) => ({ ...prev, avatar: file }));
    setPreviewAvatar(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return {
    t,
    profileData: profileQuery.data?.data,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    isEditing,
    setIsEditing,
    formData,
    handleTextChange,
    handleAvatarChange,
    handleSubmit,
    isUpdating: mutation.isPending,
    updateError: mutation.error ? (mutation.error as Error).message : null,
    previewAvatar,
  };
}
